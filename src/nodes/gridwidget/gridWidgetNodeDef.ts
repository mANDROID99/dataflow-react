import React from 'react';
import Icon from './gridwidget-icon.svg';
import { NodeDef } from "../../types/graphDefTypes";
import { BuiltInGraphParams, BuiltInGraphContext } from "../builtInNodeDefTypes";
import { NodeProcessor } from '../../types/processorTypes';
import GridWidgetNodeConfig from './GridWidgetNodeConfig';
import { Format } from '../../types/formatTypes';

export type GridViewColumnConfig = {
    label: string;
    key: string;
    width: number;
    format: Format;
}

export type Config = {
    widgetName: string;
    columns: GridViewColumnConfig[];
}

const PORT_IN_DATA = 'data';

class Processor implements NodeProcessor<BuiltInGraphContext> {
    private dataProcessor?: NodeProcessor<BuiltInGraphContext>;


    registerInverse?(portIn: string, processor: NodeProcessor<BuiltInGraphContext>) {
        if (portIn === PORT_IN_DATA) {
            this.dataProcessor = processor;
        }
    }


    next(portName: string, value: unknown): void {
        
    }

    getContext(): BuiltInGraphContext {
        return this.dataProcessor?.getChildContext() ?? { columns: [] };
    }

    getChildContext(): BuiltInGraphContext {
        return this.getContext();
    }
}

export const gridWidgetNode: NodeDef<BuiltInGraphParams, BuiltInGraphContext, Config> = {
    name: 'Grid View',
    initialConfig: {
        widgetName: '',
        columns: []
    },
    ports: {
        in: {
            [PORT_IN_DATA]: {
                label: 'data',
                type: 'rows'
            }
        },
        out: {
            subgrid: {
                label: 'subgrid',
                type: 'subgrid'
            }
        }
    },
    renderContent(props) {
        return React.createElement('image', { ...props.bounds, href: Icon });
    },
    renderConfig(props) {
        return React.createElement(GridWidgetNodeConfig, props);
    },
    processor(config, params) {
        return new Processor();
    }
}
