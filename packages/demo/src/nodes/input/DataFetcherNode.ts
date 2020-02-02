import { GraphNodeConfig, FieldInputType, Entry, NodeProcessor, expressions } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { asString } from "../../utils/converters";
import { Row, createRowsValue, RowsValue } from "../../types/valueTypes";
import { NodeType } from "../nodes";

enum HttpMethodType {
    GET = 'GET',
    POST = 'POST'
}

const KEY_DATA = 'data';

const PORT_ROWS = 'rows';
const PORT_DATA = 'data';
const PORT_SCHEDULER = 'scheduler';

class DataFetcherProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];
    private data?: Row[];
    private count = 0;
    private running = false;

    constructor(
        private readonly ctx: { [key: string]: unknown },
        private readonly method: string,
        private readonly urlMapper: expressions.Mapper,
        private readonly headersMapper: expressions.EntriesMapper,
        private readonly responseMapper: expressions.Mapper
    ) { }

    get type(): string {
        return NodeType.DATA_GRID;
    }

    registerProcessor(portIn: string, portOut: string, processor: NodeProcessor): void {
        if (portIn === PORT_DATA) {
            processor.subscribe(portOut, this.onNextData.bind(this));

        } else if (portIn === PORT_SCHEDULER) {
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
        this.data = (value as RowsValue).rows;
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

        const url = asString(this.urlMapper(ctx));
        if (!url) return;

        const headers: { [key: string]: string } = {};
        const headersArr = this.headersMapper(ctx);
        
        for (const entry of headersArr) {
            headers[entry.key] = asString(entry.value);
        }
        
        headers.Accept = 'application/json';
        const c = ++this.count;

        fetch(url, {
            method: this.method,
            headers
        })
            .then(res => res.json())
            .then(data => {
                if (this.running && this.count === c) {
                    const ctx = Object.assign({}, this.ctx);
                    ctx[KEY_DATA] = data;

                    let rows = (this.responseMapper(ctx) || data) as { [key: string]: unknown }[];

                    for (const sub of subs) {
                        sub(createRowsValue(rows));
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
            type: FieldInputType.TEXT,
            initialValue: ''
        },
        method: {
            label: 'Http Method',
            type: FieldInputType.SELECT,
            initialValue: HttpMethodType.GET,
            params: {
                options: Object.values(HttpMethodType)
            }
        },
        headers: {
            label: 'Headers',
            type: FieldInputType.DATA_ENTRIES,
            initialValue: []
        },
        mapResponse: {
            label: 'Map Response',
            type: FieldInputType.TEXT,
            initialValue: ''
        },
        columns: {
            label: 'Columns',
            type: FieldInputType.DATA_LIST,
            initialValue: []
        }
    },
    ports: {
        in: {
            [PORT_SCHEDULER]: {
                type: 'event'
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
        const method = node.fields.method as HttpMethodType;
        const headerEntries = node.fields.headers as Entry<string>[];

        const reponseMapper = expressions.compileExpression(mapResponseExpr);
        const urlMapper = expressions.compileExpression(mapUrlExpr);
        const headersMapper = expressions.compileEntriesMapper(headerEntries);

        return new DataFetcherProcessor(params.variables, method, urlMapper, headersMapper, reponseMapper)
    },
    mapContext(node): ChartContext {
        const columns = node.fields.columns as string[];
        return {
            columns: columns
        };
    }
}
