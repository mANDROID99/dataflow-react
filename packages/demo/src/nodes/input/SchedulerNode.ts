import { GraphNodeConfig, FieldInputType, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "src/chartContext";
import { NodeType } from "../nodes";

const PORT_EVENT = 'event';

class SchedulerProcessor implements NodeProcessor {
    private sub?: (value: unknown) => void;
    private handle?: number;

    constructor(
        private readonly interval: number,
        private readonly delay: number
    ) {
        this.onTick = this.onTick.bind(this);
    }

    get type(): string {
        return NodeType.SORT_BY
    }
    
    registerProcessor(): void { }

    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_EVENT) {
            this.sub = sub;
        }
    }

    onStart() {
        this.handle = window.setTimeout(this.onTick, this.delay);
    }

    onStop() {
        if (this.handle != null) {
            window.clearTimeout(this.handle);
        }
    }

    private onTick() {
        if (this.sub) {
            this.sub(null);
        }

        if (this.interval > 0) {
            this.handle = window.setTimeout(this.onTick, this.interval);
        }
    }
}

export const SCHEDULER_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Scheduler',
    menuGroup: 'Input',
    description: 'Emits a signal on a regular interval',
    ports: {
        in: {},
        out: {
            [PORT_EVENT]: {
                type: 'event'
            }
        }
    },
    fields: {
        interval: {
            label: 'Interval',   
            type: FieldInputType.NUMBER,
            initialValue: 0,
            params: {
                min: 0
            }
        },
        delay: {
            label: 'Delay',
            type: FieldInputType.NUMBER,
            initialValue: 0,
            params: {
                min: 0
            }
        }
    },
    createProcessor(node): NodeProcessor {
        const interval = node.fields.interval as number;
        const delay = node.fields.delay as number;
        return new SchedulerProcessor(interval, delay);
    }
}
