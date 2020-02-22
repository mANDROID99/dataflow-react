
export interface NodeProcessor {
    readonly type: string;
    subscribe(portName: string, sub: (value: unknown) => void): void;
    register?(portIn: string, portOut: string, processor: NodeProcessor): void;
    start?(): void;
    stop?(): void;
    invoke?(): void;
}
