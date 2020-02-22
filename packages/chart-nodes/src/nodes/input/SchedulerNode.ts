import { GraphNodeConfig, InputType, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { NodeType } from "../nodes";

const PORT_SIGNAL = 'signal';

type Config = {
    interval: number;
    delay: number;
}

class SchedulerProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];
    private handle?: number;

    constructor(private readonly config: Config) {
        this.onTick = this.onTick.bind(this);
    }

    get type(): string {
        return NodeType.SORT_BY
    }
    
    register(): void { }

    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_SIGNAL) {
            this.subs.push(sub);
        }
    }

    start() {
        this.handle = window.setTimeout(this.onTick, this.config.delay);
    }

    stop() {
        if (this.handle != null) {
            window.clearTimeout(this.handle);
        }
    }

    private onTick() {
        for (const sub of this.subs) {
            sub(null);
        }

        if (this.config.interval > 0) {
            this.handle = window.setTimeout(this.onTick, this.config.interval);
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
            [PORT_SIGNAL]: {
                type: 'signal'
            }
        }
    },
    fields: {
        interval: {
            label: 'Interval',   
            type: InputType.NUMBER,
            initialValue: 0,
            params: {
                min: 0
            }
        },
        delay: {
            label: 'Delay',
            type: InputType.NUMBER,
            initialValue: 0,
            params: {
                min: 0
            }
        }
    },
    createProcessor(node): NodeProcessor {
        const interval = node.fields.interval as number;
        const delay = node.fields.delay as number;
        return new SchedulerProcessor({
            interval,
            delay
        });
    }
}
