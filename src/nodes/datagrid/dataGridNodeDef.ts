import React from 'react';
import Icon from './datagrid-icon.svg';

import { NodeDef } from "../../types/graphDefTypes";
import { NodeProcessor } from '../../types/processorTypes';
import { BuiltInGraphParams, BuiltInGraphContext } from "../builtInNodeDefTypes";
import DataGridConfigComponent from './DataGridNodeConfig';

export type Config = {
    columns: string[];
    rows: string[][];
}

class DataGridNodeProcessor implements NodeProcessor<BuiltInGraphContext> {
    private readonly config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    register(portOut: string, portIn: string, processor: NodeProcessor<BuiltInGraphContext>): void {
        
    }

    next(): void {

    }

    getContext(): BuiltInGraphContext {
        return {
            columns: this.config.columns
        };
    }

    getChildContext(): BuiltInGraphContext {
        return this.getContext();
    }
}

export const dataGridNode: NodeDef<BuiltInGraphParams, BuiltInGraphContext, Config> = {
    name: 'Data Grid',
    initialConfig: {
        columns: [],
        rows: []
    },
    ports: {
        in: {},
        out: {
            data: {
                label: 'data',
                type: 'rows'
            }
        }
    },
    dims: {
        width: 50,
        height: 50
    },
    renderConfig(props) {
        return React.createElement(DataGridConfigComponent, props);
    },
    renderContent(props) {
        return React.createElement('image', { ...props.bounds, href: Icon });
    },
    processor(config, params) {
        return new DataGridNodeProcessor(config);
    }
}
