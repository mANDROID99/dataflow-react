
export interface NodeProcessor {

    registerConnection(portOut: string, portIn: string, processor: NodeProcessor): void;

    registerConnectionInverse(portName: string): number;

    onNext(portName: string, key: number, value: unknown): void;
    
    start?(): void;
    stop?(): void;
    invoke?(): void;
}
