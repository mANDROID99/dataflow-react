import { GraphNodeConfig, InputType, NodeProcessor, BaseNodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";

const PORT_SIGNAL = 'signal';

type Config = {
    interval: number;
    delay: number;
}

class SchedulerProcessor extends BaseNodeProcessor {
    private handle?: number;

    constructor(private readonly config: Config) {
        super();
        this.onTick = this.onTick.bind(this);
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
        this.emitResult(PORT_SIGNAL, null);

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
