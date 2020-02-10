import { GraphNodeConfig, NodeProcessor, InputType, Entry, expressions } from "@react-ngraph/core";

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
const EVENT_KEY_AUTO_COLUMNS = 'configure-auto-columns';

type Config = {
    reportUuid: string;
    mapReportParams: expressions.EntriesMapper
}

class ReportNodeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];
    private data?: Row[];
    private count = 0;
    private running = false;

    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) { }

    get type(): string {
        return NodeType.REPORT;
    }
    
    registerProcessor(portIn: string, portOut: string, processor: NodeProcessor): void {
        if (portIn === PORT_ROWS) {
            processor.subscribe(portOut, this.onNextRows.bind(this));

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

    private onNextRows(value: unknown) {
        this.data = value as Row[];
        this.update();
    }

    private onNextScheduler() {
        this.update();
    }

    private update() {
        const subs = this.subs;
        if (!subs.length) return;

        const reportUuid = this.config.reportUuid;
        if (!reportUuid) return;


        const ctx = Object.assign({}, this.params.variables);
        ctx[KEY_DATA] = this.data;
    
        const reportParams = this.resolveReportParams(ctx)

        const c = ++this.count;
        this.params.runReport(this.config.reportUuid, reportParams).then(data => {
            if (!this.running || this.count !== c) {
                return;
            }

            for (const sub of subs) {
                sub(data);
            }
        });
    }

    private resolveReportParams(ctx: { [key: string]: unknown }) {
        const reportParams: { [key: string]: string } = {};
        const paramsArr = this.config.mapReportParams(ctx);
    
        for (const entry of paramsArr) {
            reportParams[entry.key] = asString(entry.value);
        }

        return reportParams;
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
    onChanged(prev, next, { params, setFieldValue }) {
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

            setFieldValue(FIELD_REPORT_PARAMS, reportParams);
        }
    },
    onEvent(key, payload, { node, params, setFieldValue }) {
        if (key === EVENT_KEY_AUTO_COLUMNS) {
            const reportUuid = node.fields[FIELD_REPORT_UUID] as string;
            const mapReportParams = expressions
                .compileEntriesMapper(node.fields[FIELD_REPORT_PARAMS] as Entry<string>[]);

            // doFetch(reportUuid, mapReportParams, undefined, params).then(result => {
            //     setFieldValue(FIELD_COLUMNS, Object.keys(result));
            // });
        }
    }
};
