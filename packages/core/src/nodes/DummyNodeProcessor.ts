import { NodeProcessor } from "../types/nodeProcessorTypes";

export class DummyNodeProcessor implements NodeProcessor {
    registerConnection(): void {
        /* do nothing */
    }
    
    registerConnectionInverse(): number {
        return -1;
    }

    onNext(): void {
        /* do nothing */
    }
}

