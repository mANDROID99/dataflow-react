import { GraphNodeConfig, FieldInputType, Entry, expressionUtils, Processor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { asString } from "../../utils/converters";
import { Row, EMPTY_ROWS, Rows, createRows } from "../../types/valueTypes";

enum HttpMethodType {
    GET = 'GET',
    POST = 'POST'
}

export const DATA_FETCHER_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Data Fetcher',
    menuGroup: 'Input',
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
            scheduler: {
                type: 'scheduler'
            },
            rows: {
                type: 'row[]'
            }
        },
        out: {
            rows: {
                type: 'row[]'
            }
        }
    },
    createProcessor({ next, node, params }): Processor {
        const mapUrlExpr = node.fields.url as string;
        const mapResponseExpr = node.fields.mapResponse as string;
        const method = node.fields.method as HttpMethodType;
        const headerEntries = node.fields.headers as Entry<string>[];

        const mapResponse = expressionUtils.compileExpression(mapResponseExpr);
        const mapUrl = expressionUtils.compileExpression(mapUrlExpr);
        const mapHeaders = expressionUtils.compileEntryMappers(headerEntries);

        let running = false;
        let count = 0;

        function doFetch(ctx: { [key: string]: unknown }) {
            const url = asString(mapUrl(ctx));
            const headers: { [key: string]: string } = {};
            const headersArr = mapHeaders(ctx);
            
            for (const entry of headersArr) {
                headers[entry.key] = asString(entry.value);
            }
            
            headers.Accept = 'application/json'
            const c = ++count;

            fetch(url, {
                method,
                headers
            })
                .then(res => res.json())
                .then(data => {
                    if (running && count === c) {
                        const ctx = Object.assign({}, params.variables);
                        ctx.response = data;

                        const rows = (mapResponse(ctx) || data) as { [key: string]: unknown }[];
                        next('rows', createRows(rows));
                    }
                });
        }

        return {
            onStart() {
                running = true;
                doFetch(params.variables);
            },

            onNext(inputs) {
                const r = (inputs.rows[0] || EMPTY_ROWS) as Rows;
                const ctx = Object.assign({}, params.variables);
                ctx.rows = r.rows;
                doFetch(ctx);
            },

            onStop() {
                running = false;
            }
        }
    },
    mapContext({ node }): ChartContext {
        const columns = node.fields.columns as string[];
        return {
            columns: columns
        };
    }
}
