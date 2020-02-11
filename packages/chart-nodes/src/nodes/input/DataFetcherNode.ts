import { GraphNodeConfig, InputType, Entry, NodeProcessor, expressions } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { asString } from "../../utils/conversions";
import { Row } from "../../types/valueTypes";
import { NodeType } from "../nodes";

const KEY_DATA = 'data';
const PORT_ROWS = 'rows';
const PORT_DATA = 'data';
const PORT_SIGNAL = 'signal';
const BTN_RESOLVE_COLUMNS = 'btn-resolve-columns';

type Config = {
    mapUrl: expressions.Mapper,
    mapHeaders: expressions.EntriesMapper,
    mapResponse: expressions.Mapper
};

function doFetch(url: string, headers: { [key: string]: string}, mapResponse: expressions.Mapper, params: ChartParams) {
    return params.fetch({
        url,
        method: 'GET',
        headers
    })
        .then(res => res.json())
        .then(data => {
            const ctx = Object.assign({}, params.variables);
            ctx[KEY_DATA] = data;

            return (mapResponse(ctx) || data) as { [key: string]: unknown }[];
        });
}

function resolveHeaders(mapHeaders: expressions.EntriesMapper, ctx: { [key: string]: unknown }) {
    const headers: { [key: string]: string } = {};
    const headersArr = mapHeaders(ctx);
    for (const entry of headersArr) {
        headers[entry.key] = asString(entry.value);
    }
    
    headers.Accept = 'application/json';
    return headers;
}

class DataFetcherProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];
    private data?: Row[];
    private count = 0;
    private running = false;

    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) { }

    get type(): string {
        return NodeType.DATA_GRID;
    }

    registerProcessor(portIn: string, portOut: string, processor: NodeProcessor): void {
        if (portIn === PORT_DATA) {
            processor.subscribe(portOut, this.onNextData.bind(this));

        } else if (portIn === PORT_SIGNAL) {
            processor.subscribe(portOut, this.onNextScheduler.bind(this));
        }
    }

    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_ROWS) {
            this.subs.push(sub);
        }
    }

    start() {
        this.running = true;
    }

    stop() {
        this.running = false;
    }

    private onNextData(value: unknown) {
        this.data = value as Row[];
        this.update();
    }

    private onNextScheduler() {
        this.update();
    }
    
    private update() {
        const subs = this.subs;
        if (!subs.length) return;

        const ctx = Object.assign({}, this.params.variables);
        ctx[KEY_DATA] = this.data;

        const config = this.config;
        const url = asString(config.mapUrl(ctx));
        if (!url) return;

        const headers = resolveHeaders(config.mapHeaders, ctx);
        const c = ++this.count;

        doFetch(url, headers, config.mapResponse, this.params)
            .then(data => {
                if (this.running && this.count === c) {
                    for (const sub of subs) {
                        sub(data);
                    }
                }
            });
    }
}

export const DATA_FETCHER_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Data Fetcher',
    menuGroup: 'Input',
    description: 'Fetches data by performing an HTTP request.',
    fields: {
        url: {
            label: 'Map URL',
            type: InputType.TEXT,
            initialValue: ''
        },
        headers: {
            label: 'Headers',
            type: InputType.DATA_ENTRIES,
            initialValue: []
        },
        mapResponse: {
            label: 'Map Response',
            type: InputType.TEXT,
            initialValue: ''
        },
        columns: {
            label: 'Columns',
            type: InputType.DATA_LIST,
            initialValue: []
        },
        actions: {
            label: 'Actions',
            type: InputType.ACTIONS,
            initialValue: null,
            params: {
                actions: [
                    {
                        label: 'Resolve Columns',
                        key: BTN_RESOLVE_COLUMNS,
                        variant: 'secondary'
                    }
                ]
            }
        }
    },
    ports: {
        in: {
            [PORT_SIGNAL]: {
                type: 'signal'
            },
            [PORT_DATA]: {
                type: 'row[]'
            }
        },
        out: {
            [PORT_ROWS]: {
                type: 'row[]'
            }
        }
    },
    createProcessor(node, params): NodeProcessor {
        const mapUrlExpr = node.fields.url as string;
        const mapResponseExpr = node.fields.mapResponse as string;
        const headerEntries = node.fields.headers as Entry<string>[];

        const mapUrl = expressions.compileExpression(mapUrlExpr);
        const mapHeaders = expressions.compileEntriesMapper(headerEntries);
        const mapResponse = expressions.compileExpression(mapResponseExpr);

        return new DataFetcherProcessor(params, {
            mapUrl,
            mapHeaders,
            mapResponse
        });
    },
    mapContext(node): ChartContext {
        const columns = node.fields.columns as string[];
        return { columns };
    },
    onEvent(key, payload, { node, params, setFieldValue }) {
        if (key === BTN_RESOLVE_COLUMNS) {
            const ctx = params.variables;
            const mapUrl = expressions.compileExpression(node.fields.url as string);
            const mapResponse = expressions.compileExpression(node.fields.mapResponse as string);
            const mapHeaders = expressions.compileEntriesMapper(node.fields.headers as Entry<string>[]);

            const url = asString(mapUrl(ctx));
            const headers = resolveHeaders(mapHeaders, ctx);

            doFetch(url, headers, mapResponse, params).then((result) => {
                if (result && result.length) {
                    const first = result[0];
                    setFieldValue('columns', Object.keys(first));
                }
            })
        }
    }
}
