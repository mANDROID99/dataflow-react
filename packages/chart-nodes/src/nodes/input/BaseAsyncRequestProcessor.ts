import { NodeProcessor } from "@react-ngraph/core";

export abstract class BaseAsyncRequestProcessor<D, R> implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    abstract type: string;
    private data?: D;
    private count = 0;
    private running = false;

    abstract registerProcessor(portIn: string, portOut: string, processor: NodeProcessor): void;
    
    abstract subscribe(portName: string, sub: (value: unknown) => void): void;

    abstract handleRequest(data: D | undefined): Promise<R>;

    abstract handleResult(value: R): void;

    onStart() {
        this.running = true;
    }

    onStop() {
        this.running = false;
    }

    protected onNextData(value: unknown) {
        this.data = value as D;
        this.update();
    }

    protected onNextScheduler() {
        this.update();
    }

    private update() {
        const subs = this.subs;
        if (!subs.length) return;

        const c = ++this.count;
        this.handleRequest(this.data).then((result) => {
            if (!this.running || this.count !== c) {
                return;
            }

            this.handleResult(result);
        });
    }
}
