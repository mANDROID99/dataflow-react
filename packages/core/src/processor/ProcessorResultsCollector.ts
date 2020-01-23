import { NodeProcessor } from "./NodeProcessor";

export class ProcessorResultsCollector<Ctx> {
    private readonly processors: NodeProcessor<Ctx>[];
    private readonly subscribers: ((value: unknown[]) => void)[] = [];
    private readonly results: unknown[] = [];
    
    private received = 0;

    constructor(processors: NodeProcessor<Ctx>[]) {
        this.processors = processors;
        for (let i = 0, n = processors.length; i < n; i++) {
            processors[i].subscribe('out', this.onResult.bind(this, i));
        }
    }

    subscribe(fn: (value: unknown[]) => void): void {
        this.subscribers.push(fn);
    }

    private onResult(index: number, result: unknown) {
        if (this.received < this.processors.length) {
            ++this.received;
        }

        this.results[index] = result;
        
        if (this.received === this.processors.length) {
            for (const sub of this.subscribers) {
                sub(this.results);
            }
        }
    }
}
