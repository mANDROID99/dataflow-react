import { dataGridNode } from "./datagrid/dataGridNodeDef";
import { BuiltInNodeType, BuiltInGraphParams, BuiltInGraphContext } from "./builtInNodeDefTypes";
import { NodeDef } from "../types/graphDefTypes";
import { gridWidgetNode } from "./gridwidget/gridWidgetNodeDef";

export const builtInGraphNodes: { [K in BuiltInNodeType]: NodeDef<BuiltInGraphParams, BuiltInGraphContext, any> } = {
    [BuiltInNodeType.DATA_GRID]: dataGridNode,
    [BuiltInNodeType.GRID_WIDGET]: gridWidgetNode
}
