import { GraphNodeConfig, NodeProcessor, InputType, Entry, expressions, BaseNodeProcessor } from "@react-ngraph/core";

import { ChartContext, ChartParams } from "../../types/contextTypes";
import { NodeType } from "../nodes";
import { Row } from "../../types/valueTypes";
import { asString } from "../../utils/conversions";

const PORT_SIGNAL = 'signal';
const PORT_ROWS = 'rows';
const FIELD_REPORT_UUID = 'uuid';
const FIELD_REPORT_PARAMS = 'params';
const FIELD_COLUMNS = 'columns';
const KEY_DATA = 'data';
const BTN_RESOLVE_COLUMNS = 'btn-resolve-columns';

type Config = {
    reportUuid: string;
    mapReportParams: expressions.EntriesMapper
}

function resolveReportParams(mapReportParams: expressions.EntriesMapper, ctx: { [key: string]: unknown }) {
    const reportParams: { [key: string]: string } = {};
    const paramsArr = mapReportParams(ctx);

    for (const entry of paramsArr) {
        reportParams[entry.key] = asString(entry.value);
    }

    return reportParams;
}

class ReportNodeProcessor extends BaseNodeProcessor {
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

    registerConnectionInverse(portName: string): number {
        if (portName === PORT_SIGNAL) {
            this.waitForSignal = true;
        }
        return super.registerConnectionInverse(portName);
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

    process(portName: string, values: unknown[]) {
        if (portName === PORT_ROWS) {
            this.onNextRows(values[0]);
        } else if (portName === PORT_SIGNAL) {
            this.onNextSignal();
        }
    }

    private onNextRows(value: unknown) {
        this.data = value as Row[];
        this.update();
    }

    private onNextSignal() {
        this.update();
    }

    private update() {
        const reportUuid = this.config.reportUuid;
        if (!reportUuid) return;

        const ctx = Object.assign({}, this.params.variables);
        ctx[KEY_DATA] = this.data;
    
        const reportParams = resolveReportParams(this.config.mapReportParams, ctx)
        const c = ++this.count;
        this.params.actions.runReport(this.config.reportUuid, reportParams).then(data => {
            if (!this.running || this.count !== c) {
                return;
            }

            this.emitResult(PORT_ROWS, data);
        });
    }
}

export const REPORT_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Report',
    menuGroup: 'Input',
    description: 'Executes a report, passing the response as rows to the next processor in the chain.',
    ports: {
        in: {
            [PORT_SIGNAL]: {
                type: 'signal'
            },
            [PORT_ROWS]: {
                type: 'row[]'
            }
        },
        out: {
            [PORT_ROWS]: {
                type: 'row[]'
            }
        }
    },
    fields: {
        [FIELD_REPORT_UUID]: {
            label: 'Report UUID',
            initialValue: '',
            type: InputType.SELECT,
            resolve: {
                compute: ({ params }) => ({
                    options: params.reports.map(report => ({
                        label: report.name,
                        value: report.uuid
                    }))
                }),
                eq: (prev, next) => prev.params.reports === next.params.reports
            }
        },
        [FIELD_REPORT_PARAMS]: {
            label: 'Report Params',
            initialValue: [],
            type: InputType.DATA_ENTRIES
        },
        [FIELD_COLUMNS]: {
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
    createProcessor(node, params): NodeProcessor {
        const reportUuid = node.fields[FIELD_REPORT_UUID] as string;
        const mapReportParams = expressions.compileEntriesMapper(node.fields[FIELD_REPORT_PARAMS] as Entry<string>[]);
        return new ReportNodeProcessor(params, {
            reportUuid,
            mapReportParams
        });
    },
    mapContext(node): ChartContext {
        const columns = node.fields[FIELD_COLUMNS] as string[];
        return { columns };
    },
    onChanged(prev, next, { params, actions }) {
        if (!prev || (prev.fields[FIELD_REPORT_UUID] !== next.fields[FIELD_REPORT_UUID])) {
            const reportUuid = next.fields[FIELD_REPORT_UUID] as string;
            const report = params.reports.find(report => report.uuid === reportUuid);
            let reportParams: Entry<string>[] = [];

            if (report) {
                reportParams = report.parameters.map<Entry<string>>(param => ({
                    key: param.name,
                    value: '' + param.defaultValue
                }));
            }

            actions.setFieldValue(FIELD_REPORT_PARAMS, reportParams);
        }
    },
    onEvent(key, payload, { node, params, actions }) {
        if (key === BTN_RESOLVE_COLUMNS) {
            const reportUuid = node.fields[FIELD_REPORT_UUID] as string;
            const mapReportParams = expressions.compileEntriesMapper(node.fields[FIELD_REPORT_PARAMS] as Entry<string>[]);
            const reportParams = resolveReportParams(mapReportParams, params.variables);

            params.actions.runReport(reportUuid, reportParams).then(data => {
                if (data && data.length) {
                    const first = data[0];
                    actions.setFieldValue(FIELD_COLUMNS, Object.keys(first));
                }
            });
        }
    }
};
