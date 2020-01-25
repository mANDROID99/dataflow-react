import { GraphNodeConfig, FieldInputType, Entry, expressionUtils } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { asString } from "../../utils/converters";
import { Row } from "../../types/valueTypes";

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
        mapData: {
            label: 'Map Data',
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
            }
        },
        out: {
            rows: {
                type: 'row[]'
            }
        }
    },
    createProcessor({ node, params }) {
        const urlMapperExpr = node.fields.url as string;
        const method = node.fields.method as HttpMethodType;
        const headerEntries = node.fields.headers as Entry<string>[];
        const dataMapperExpr = node.fields.mapData as string;
        const mapData = expressionUtils.compileExpression(dataMapperExpr);
        const mapUrl = expressionUtils.compileExpression(urlMapperExpr);
        const mapHeaders = expressionUtils.compileEntryMappers(headerEntries);

        return (inputs, next) => {
            const url = asString(mapUrl(params.variables));

            const headers: { [key: string]: string } = {};
            const headersArr = mapHeaders(params.variables);
            
            for (const entry of headersArr) {
                headers[entry.key] = asString(entry.value);
            }

            let cancelled = false;

            fetch(url, {
                method,
                headers
            })
                .then(res => res.json())
                .then(data => {
                    if (!cancelled) {
                        const ctx = Object.assign({}, params.variables);
                        ctx.data = data;

                        const values = (mapData(ctx) || data) as { [key: string]: unknown }[];
                        const rows = values.map((vs): Row => ({ values: vs }));
                        next('rows', rows);
                    }
                });

            return () => {
                cancelled = true;
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
