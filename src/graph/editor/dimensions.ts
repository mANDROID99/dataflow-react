import { GraphNodeConfig, GraphConfig, GraphNodeEditorConfig } from "graph/types/graphConfigTypes";

export const HEADER_ICON_INNER_SIZE = 14;
export const HEADER_ICON_OUTER_W = 30;
export const HEADER_ICON_OUTER_H = 25;

export const NODE_WIDTH = 100;

export const HEADER_HEIGHT = 25;
export const PORT_HEIGHT = 25;
export const EDITOR_LABEL_HEIGHT = 15;
export const EDITOR_FIELD_HEIGHT = 30;

export const PORT_LABEL_OFFSET_X = 12;


export type NodeDimensions = {
    fullWidth: number;
    fullHeight: number;
    fieldsHeight: number;
    portsInHeight: number;
    portsOutHeight: number
    contentHeight: number;
    headerHeight: number;
}

function computeWidth(nodeType: string, config: GraphConfig<any>): number {
    const nodeConfig = config.nodes[nodeType];
    return (nodeConfig.width ?? NODE_WIDTH) + HEADER_ICON_OUTER_W * 2;
}

function computeFieldsHeight(nodeConfig: GraphNodeConfig<any>, config: GraphConfig<any>): number {
    let fieldsHeight = 0;

    for (const field of Object.values(nodeConfig.fields)) {
        const editor = config.editors[field.editor];

        if (editor) {
            fieldsHeight += (editor.height ?? EDITOR_FIELD_HEIGHT) + EDITOR_LABEL_HEIGHT;
        }
    }

    return fieldsHeight;
}

function computePortsInHeight(nodeConfig: GraphNodeConfig<any>): number {
    return Object.keys(nodeConfig.ports.in).length * PORT_HEIGHT;
}

function computePortsOutHeight(nodeConfig: GraphNodeConfig<any>): number {
    return Object.keys(nodeConfig.ports.out).length * PORT_HEIGHT;
}

export function computeDimensions(nodeType: string, config: GraphConfig<any>): NodeDimensions {
    const nodeConfig = config.nodes[nodeType];
    const fieldsHeight = computeFieldsHeight(nodeConfig, config);
    const portsInHeight = computePortsInHeight(nodeConfig);
    const portsOutHeight = computePortsOutHeight(nodeConfig);

    let contentHeight = fieldsHeight;

    if (portsInHeight > contentHeight) {
        contentHeight = portsInHeight;
    }

    if (portsOutHeight > contentHeight) {
        contentHeight = portsOutHeight;
    }

    const headerHeight = HEADER_HEIGHT;

    const fullWidth = computeWidth(nodeType, config)
    const fullHeight = contentHeight + headerHeight;

    return {
        headerHeight,
        fullWidth,
        fullHeight,
        fieldsHeight,
        contentHeight,
        portsInHeight,
        portsOutHeight
    };
}

export function computePortY(portIndex: number, portOut: boolean, dims: NodeDimensions): number {
    const portHeight = portOut ? dims.portsOutHeight : dims.portsInHeight;
    return dims.headerHeight + (dims.contentHeight - portHeight + PORT_HEIGHT) / 2 + portIndex * PORT_HEIGHT;
}

export function translate(x: number, y: number) {
    return `translate(${x},${y})`;
}
