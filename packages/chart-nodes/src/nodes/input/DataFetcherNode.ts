import { GraphNodeConfig, InputType, Entry, NodeProcessor, expressions } from "@react-ngraph/core";
import { ChartContext, ChartParams, RequestHandler } from "../../types/contextTypes";
import { asString } from "../../utils/conversions";
import { Row } from "../../types/valueTypes";
import { NodeType } from "../nodes";

const KEY_DATA = 'data';
const PORT_ROWS = 'rows';
const PORT_DATA = 'data';
const PORT_SIGNAL = 'signal';

type Config = {
    mapUrl: expressions.Mapper,
    mapHeaders: expressions.EntriesMapper,
    mapResponse: expressions.Mapper
};

class DataFetcherProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];
    private data?: Row[];
    private count = 0;
    private running = false;

    constructor(
        private readonly ctx: { [key: string]: unknown },
        private readonly requestHandler: RequestHandler,
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

    onStart() {
        this.running = true;
    }

    onStop() {
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

        const ctx = Object.assign({}, this.ctx);
        ctx[KEY_DATA] = this.data;

        const config = this.config;
        const url = asString(config.mapUrl(ctx));
        if (!url) return;

        const headers: { [key: string]: string } = {};
        const headersArr = config.mapHeaders(ctx);
        
        for (const entry of headersArr) {
            headers[entry.key] = asString(entry.value);
        }
        
        headers.Accept = 'application/json';
        const c = ++this.count;

        this.requestHandler({
            url,
            method: 'GET',
            headers
        })
            .then(res => res.json())
            .then(data => {
                if (this.running && this.count === c) {
                    const ctx = Object.assign({}, this.ctx);
                    ctx[KEY_DATA] = data;

                    let rows = (config.mapResponse(ctx) || data) as { [key: string]: unknown }[];

                    for (const sub of subs) {
                        sub(rows);
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

        return new DataFetcherProcessor(params.variables, params.requestHandler, {
            mapUrl,
            mapHeaders,
            mapResponse
        });
    },
    mapContext(node): ChartContext {
        const columns = node.fields.columns as string[];
        return {
            columns: columns
        };
    }
}
