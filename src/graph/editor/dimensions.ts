import { GraphNodeConfig, GraphConfig, GraphNodeEditorConfig } from "graph/types/graphConfigTypes";

export const HEADER_ICON_INNER_SIZE = 14;
export const HEADER_ICON_OUTER_W = 30;
export const HEADER_ICON_OUTER_H = 25;

export const NODE_CONTENT_WIDTH = 150;
export const HEADER_HEIGHT = 25;
export const PORT_HEIGHT = 25;

export const PORT_LABEL_OFFSET_X = 12;
export const FIELD_PAD_X = 10;
export const FIELD_GAP = 10;
export const FIELD_LABEL_HEIGHT = 15;
export const FIELD_EDITOR_HEIGHT = 30;

export type Dims = {
    x: number;
    y: number;
    height: number;
    width: number;
}

export type Point = {
    x: number;
    y: number;
}

export type GraphNodeDims = {
    header: Dims;
    outer: Dims;
    fields: Map<string, Dims>;
    portsIn: Map<string, Point>;
    portsOut: Map<string, Point>;
}

function computePortsInHeight(nodeConfig: GraphNodeConfig<any>): number {
    return Object.keys(nodeConfig.ports.in).length * PORT_HEIGHT;
}

function computePortsOutHeight(nodeConfig: GraphNodeConfig<any>): number {
    return Object.keys(nodeConfig.ports.out).length * PORT_HEIGHT;
}

function computeFieldsHeight(nodeConfig: GraphNodeConfig<any>, config: GraphConfig<any>): number {
    const fieldsConfig = nodeConfig.fields;
    let h = FIELD_GAP;

    for (const fieldId in fieldsConfig) {
        const field = fieldsConfig[fieldId];
        const editor = config.editors[field.editor];
        h += FIELD_GAP + FIELD_LABEL_HEIGHT;
        h += (editor ? editor.height ?? FIELD_EDITOR_HEIGHT : 0);
    }

    return h;
}

function computeOuterHeight(nodeConfig: GraphNodeConfig<any>, config: GraphConfig<any>): number {
    let height = computePortsInHeight(nodeConfig);
    
    let h = HEADER_HEIGHT + computeFieldsHeight(nodeConfig, config);
    if (h > height) {
        height = h;
    }

    h = computePortsOutHeight(nodeConfig);
    if (h > height) {
        height = h;
    }

    return height;
}

function computeOuterWidth(nodeConfig: GraphNodeConfig<any>) {
    return nodeConfig.width ?? NODE_CONTENT_WIDTH;
}

function computeFieldDims(nodeConfig: GraphNodeConfig<any>, contentWidth: number, config: GraphConfig<any>): Map<string, Dims> {
    const fieldsConfig = nodeConfig.fields;
    const width = contentWidth - FIELD_PAD_X * 2;
    const dims = new Map<string, Dims>();

    let h = HEADER_HEIGHT + FIELD_GAP;

    for (const fieldId in fieldsConfig) {
        const field = fieldsConfig[fieldId];
        const editor = config.editors[field.editor];
        const height = FIELD_GAP + FIELD_LABEL_HEIGHT + (editor ? editor.height ?? FIELD_EDITOR_HEIGHT : 0);

        const x = FIELD_PAD_X;
        const y = h;

        h += height;

        dims.set(fieldId, {
            x, y, width, height
        });
    }

    return dims;
}

function computePortsInDims(nodeConfig: GraphNodeConfig<any>, contentHeight: number): Map<string, Point> {
    const ports = nodeConfig.ports.in;
    const dims = new Map<string, Point>();
    const totalHeight = computePortsInHeight(nodeConfig);

    let i = 0;
    for (const portId in ports) {
        const y = (contentHeight - totalHeight + PORT_HEIGHT) / 2 + (i++) * PORT_HEIGHT;
        dims.set(portId, { x: 0, y });
    }

    return dims;
}

function computePortsOutDims(nodeConfig: GraphNodeConfig<any>, contentWidth: number, contentHeight: number): Map<string, Point> {
    const ports = nodeConfig.ports.out;
    const dims = new Map<string, Point>();
    const totalHeight = computePortsOutHeight(nodeConfig);

    let i = 0;
    for (const portId in ports) {
        const y = (contentHeight - totalHeight + PORT_HEIGHT) / 2 + (i++) * PORT_HEIGHT;
        dims.set(portId, { x: contentWidth, y });
    }

    return dims;
}

function computeHeaderDims(width: number): Dims {
    return {
        x: 0,
        y: 0,
        width,
        height: HEADER_HEIGHT
    };
}

function computeOuterDims(width: number, height: number): Dims {
    return {
        x: 0,
        y: 0,
        width,
        height
    };
}

export function computeDimensions(nodeType: string, config: GraphConfig<any>): GraphNodeDims {
    const nodeConfig = config.nodes[nodeType];

    const outerWidth = computeOuterWidth(nodeConfig);
    const outerHeight = computeOuterHeight(nodeConfig, config);

    const fields = computeFieldDims(nodeConfig, outerWidth, config);
    const portsIn = computePortsInDims(nodeConfig, outerHeight);
    const portsOut = computePortsOutDims(nodeConfig, outerWidth, outerHeight);
    const header = computeHeaderDims(outerWidth);
    const outer = computeOuterDims(outerWidth, outerHeight);

    return {
        outer,
        header,
        fields,
        portsIn,
        portsOut
    };
}

export function translate(x: number, y: number) {
    return `translate(${x},${y})`;
}
