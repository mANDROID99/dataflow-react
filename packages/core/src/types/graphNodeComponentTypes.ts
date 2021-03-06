import { GraphNode } from "./graphTypes";
import { GraphNodeConfig } from "./graphConfigTypes";

export enum DragType {
    DRAG_POS,
    DRAG_WIDTH,
    DRAG_SIZE
}

export type GraphNodeActions = {
    setPos(x: number, y: number): void;
    setSize(width: number, height: number): void;
    setWidth(width: number): void;
    setFieldValue(fieldName: string, value: unknown): void;
    setCollapsed(collapsed: boolean): void;
    select(): void;
    showContextMenu(x: number, y: number): void;
    triggerEvent(key: string, payload: null): void;
    triggerNodeChanged(prev: GraphNode | undefined, next: GraphNode): void;
}

export type GraphNodeComponentProps<C, P> = {
    nodeId: string;
    node: GraphNode;
    nodeConfig: GraphNodeConfig<C, P>;
    context: C;
    params: P;
    actions: GraphNodeActions;
    selected: boolean;
    width: number;
    height: number;
    handleDrag: (event: React.MouseEvent, type: DragType) => void;
}
