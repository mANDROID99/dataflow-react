import { GraphNodeConfig, NodeProcessor, InputType, Entry, expressions } from "@react-ngraph/core";

import { ChartContext, ChartParams, RequestHandler } from "../../types/contextTypes";
import { NodeType } from "../nodes";
import { Row } from "../../types/valueTypes";
import { asString } from "../../utils/conversions";

const PORT_SIGNAL = 'signal';
const PORT_ROWS = 'rows';
const FIELD_REPORT_UUID = 'uuid';
const FIELD_REPORT_PARAMS = 'params';
const KEY_DATA = 'data';

const URL_RUN_REPORT = 'sec/api/report-transform/run';

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
        private readonly ctx: { [key: string]: unknown },
        private readonly requestHandler: RequestHandler,
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

    onStart() {
        this.running = true;
    }

    onStop() {
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

        const ctx = Object.assign({}, this.ctx);
        ctx[KEY_DATA] = this.data;

        const reportUuid = this.config.reportUuid;
        if (!reportUuid) return;

        const reportParams: { [key: string]: string } = {};
        const paramsArr = this.config.mapReportParams(ctx);

        for (const entry of paramsArr) {
            reportParams[entry.key] = asString(entry.value);
        }
        
        const c = ++this.count;

        const body = {
            transforms: [],
            'report-uuid': reportUuid,
            offset: 0,
            count: -1,
            params: reportParams
        };

        this.requestHandler({
            url: URL_RUN_REPORT,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body
        })
            .then(res => res.json())
            .then(data => {
                if (!this.running || this.count !== c) {
                    return;
                }

                for (const sub of subs) {
                    sub(data.data);
                }
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
            type: InputType.DATA_ENTRIES,
            resolve: {
                compute: ({ fields, params }) => {
                    const report = params.reports.find(report => report.uuid === fields[FIELD_REPORT_UUID]);
                    let reportParams: Entry<string>[] = [];

                    if (report) {
                        reportParams = report.parameters.map<Entry<string>>(param => ({
                            key: param.name,
                            value: '' + param.defaultValue
                        }));
                    }

                    return {
                        value: reportParams
                    }
                },
                eq: (prev, next) => prev.fields[FIELD_REPORT_UUID] === next.fields[FIELD_REPORT_UUID]
            }
        }
    },
    createProcessor(node, params): NodeProcessor {
        const reportUuid = node.fields[FIELD_REPORT_UUID] as string;
        const mapReportParams = expressions.compileEntriesMapper(node.fields[FIELD_REPORT_PARAMS] as Entry<string>[]);
        return new ReportNodeProcessor(params.variables, params.requestHandler, { reportUuid, mapReportParams });
    }
};


