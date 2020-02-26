
export interface NodeProcessor {
    registerConnection(portOut: string, portIn: string, processor: NodeProcessor): void;
    registerConnectionInverse(portOut: string, portIn: string, processor: NodeProcessor): number;
    onNext(portName: string, key: number, value: unknown): void;
    start?(): void;
    stop?(): void;
    invoke?(): void;
}
