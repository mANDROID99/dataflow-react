import { BaseNodeProcessor, Entry, GraphNodeConfig, InputType, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { Row } from "../../types/valueTypes";
import { asString } from "../../utils/conversions";
import { compileEntriesMapper, compileExpression, EntriesMapper, Mapper } from "../../utils/expressionUtils";

const KEY_DATA = 'data';
const PORT_ROWS = 'rows';
const PORT_DATA = 'data';
const PORT_SIGNAL = 'signal';
const BTN_RESOLVE_COLUMNS = 'btn-resolve-columns';

const FIELD_URL = 'url';
const FIELD_QUERY_PARAMS = 'params';
const FIELD_COLUMNS = 'columns';
const FIELD_HEADERS = 'headers';
const FIELD_MAP_RESPONSE = 'mapResponse';
const FIELD_ACTIONS = 'actions';

type Config = {
    mapUrl: Mapper,
    mapQueryParams: EntriesMapper,
    mapHeaders: EntriesMapper,
    mapResponse: Mapper
};

async function doFetch(url: string, headers: { [key: string]: string}, mapResponse: Mapper, params: ChartParams) {
    const response = await params.actions.fetch({
        url,
        method: 'GET',
        headers
    });

    const data = await response.json();
    const ctx = Object.assign({}, params.variables);
    ctx[KEY_DATA] = data;
    
    return (mapResponse(ctx) || data) as { [key: string]: unknown }[];
}

function resolveHeaders(mapHeaders: EntriesMapper, ctx: { [key: string]: unknown }) {
    const headers: { [key: string]: string } = {};
    const headersArr = mapHeaders(ctx);
    for (const entry of headersArr) {
        headers[entry.key] = asString(entry.value);
    }
    
    headers.Accept = 'application/json';
    return headers;
}

function resolveUrl(mapUrl: Mapper, mapQueryParams: EntriesMapper, ctx: { [key: string]: unknown }): string | undefined {
    let url = asString(mapUrl(ctx));
    if (!url) return;

    const queryParams = mapQueryParams(ctx);
    if (queryParams.length) {
        if (!url.endsWith('?')) {
            url = url + '?';
        }

        const searchParams = new URLSearchParams();
        for (const param of queryParams) {
            searchParams.append(param.key, asString(param.value));
        }

        url = url + searchParams;
    }

    return url;
}

class DataFetcherProcessor extends BaseNodeProcessor {
    private data?: Row[];
    private count = 0;
    private running = false;
    private waitForSignal = false;

    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) {
        super();
    }

    registerConnectionInverse(portOut: string, portIn: string, processor: NodeProcessor): number {
        if (portIn === PORT_SIGNAL) {
            this.waitForSignal = true;
        }
        return super.registerConnectionInverse(portOut, portIn, processor);
    }

    process(portName: string, values: unknown[]) {
        if (portName === PORT_DATA) {
            this.onNextData(values[0]);

        } else if (portName === PORT_SIGNAL) {
            this.onNextSignal();
        }
    }

    start() {
        this.running = true;
        if (!this.waitForSignal) {
            this.update();
        }
    }

    stop() {
        this.running = false;
    }

    private onNextData(value: unknown) {
        this.data = value as Row[];
        this.update();
    }

    private onNextSignal() {
        this.update();
    }
    
    private update() {
        const ctx = Object.assign({}, this.params.variables);
        ctx[KEY_DATA] = this.data;

        const config = this.config;
        const url = resolveUrl(config.mapUrl, config.mapQueryParams, ctx);
        if (!url) return;
        
        const headers = resolveHeaders(config.mapHeaders, ctx);
        const c = ++this.count;

        doFetch(url, headers, config.mapResponse, this.params)
            .then(data => {
                if (this.running && this.count === c) {
                    this.emitResult(PORT_ROWS, data);
                }
            });
    }
}

export const DATA_FETCHER_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Data Fetcher',
    menuGroup: 'Input',
    description: 'Fetches data by performing an HTTP request.',
    fields: {
        [FIELD_URL]: {
            label: 'Map URL',
            type: InputType.TEXT,
            initialValue: ''
        },
        [FIELD_QUERY_PARAMS]: {
            label: 'Query Params',
            type: InputType.MULTI,
            initialValue: [],
            subFields: {
                key: {
                    label: 'Key',
                    initialValue: '',
                    type: InputType.TEXT
                },
                value: {
                    label: 'Value',
                    initialValue: '',
                    type: InputType.TEXT
                }
            }
        },
        [FIELD_HEADERS]: {
            label: 'Headers',
            type: InputType.MULTI,
            initialValue: [],
            subFields: {
                key: {
                    label: 'Key',
                    initialValue: '',
                    type: InputType.TEXT
                },
                value: {
                    label: 'Value',
                    initialValue: '',
                    type: InputType.TEXT
                }
            }
        },
        [FIELD_MAP_RESPONSE]: {
            label: 'Map Response',
            type: InputType.TEXT,
            initialValue: ''
        },
        [FIELD_COLUMNS]: {
            label: 'Columns',
            type: InputType.MULTI,
            initialValue: [],
            subFields: {
                column: {
                    label: 'Value',
                    initialValue: '',
                    type: InputType.TEXT
                }
            }
        },
        [FIELD_ACTIONS]: {
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
        const mapUrlExpr = node.fields[FIELD_URL] as string;
        const mapResponseExpr = node.fields[FIELD_MAP_RESPONSE] as string;
        const headerEntries = node.fields[FIELD_HEADERS] as Entry<string>[];
        const queryParamEntries = node.fields[FIELD_QUERY_PARAMS] as Entry<string>[];

        const mapUrl = compileExpression(mapUrlExpr);
        const mapQueryParams = compileEntriesMapper(queryParamEntries);
        const mapHeaders = compileEntriesMapper(headerEntries);
        const mapResponse = compileExpression(mapResponseExpr);

        return new DataFetcherProcessor(params, {
            mapUrl,
            mapQueryParams,
            mapHeaders,
            mapResponse
        });
    },
    mapContext({ node }) {
        const columns = node.fields[FIELD_COLUMNS] as string[];
        return { columns };
    },
    onEvent(key, payload, { node, params, actions }) {
        if (key === BTN_RESOLVE_COLUMNS) {
            const ctx = params.variables;
            const mapUrl = compileExpression(node.fields[FIELD_URL] as string);
            const mapQueryParams = compileEntriesMapper(node.fields[FIELD_QUERY_PARAMS] as Entry<string>[]);
            const mapResponse = compileExpression(node.fields[FIELD_MAP_RESPONSE] as string);
            const mapHeaders = compileEntriesMapper(node.fields[FIELD_HEADERS] as Entry<string>[]);

            const url = resolveUrl(mapUrl, mapQueryParams, ctx);
            if (!url) return;

            const headers = resolveHeaders(mapHeaders, ctx);

            doFetch(url, headers, mapResponse, params).then((result) => {
                if (result && result.length) {
                    const first = result[0];
                    const columns = Object.keys(first).map((column) => ({ column }));
                    actions.setFieldValue(FIELD_COLUMNS, columns);
                }
            })
        }
    }
}
