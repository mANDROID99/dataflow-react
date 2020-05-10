export interface NodeProcessor<Ctx> {

    register?(portOut: string, portIn: string, processor: NodeProcessor<Ctx>): void;

    registerInverse?(portIn: string, processor: NodeProcessor<Ctx>): void;

    next(portName: string, value: unknown): void;

    start?(): void;

    stop?(): void;

    getContext(): Ctx;

    getChildContext(): Ctx;
}
