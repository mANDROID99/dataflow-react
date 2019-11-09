import { GraphSpec } from "./graphSpecTypes";
import { ConnectionsManager } from "../components/ConnectionsManager";

export type GraphContext = {
    graphId: string;
    spec: GraphSpec;
    connections: ConnectionsManager | undefined;
}

// export type GraphActions = {
//     removeNode(node: string): void;
//     setNodePosition(node: string, x: number, y: number): void;
//     setNodeFieldValue(node: string, field: string, value: unknown): void;
//     clearPortConnections(node: string, port: string, portOut: boolean): void;
//     addPortConnection(node: string, port: string, portOut: boolean, targetNode: string, targetPort: string): void;
//     beginPortDrag(node: string, port: string, portOut: boolean): void;
//     endPortDrag(): void;
//     setPortDragTarget(node: string, port: string, portOut: boolean): void;
//     clearPortDragTarget(node: string, port: string, portOut: boolean): void;
// }
