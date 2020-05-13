import React, { useReducer, useCallback, useEffect } from 'react';
import { ConfigComponentProps } from "../../types/graphDefTypes";
import { BuiltInGraphParams, BuiltInGraphContext } from "../builtInNodeDefTypes";
import { Config } from "./gridWidgetNodeDef";
import { reducer, ActionType } from './reducer';
import GridViewColumnConfig from './GridWidgetColumnConfig';
import TextInput from '../../components/common/form/TextInput';
import ListInput from '../../components/common/form/ListInput';

export default function GridWidgetNodeConfig(props: ConfigComponentProps<BuiltInGraphParams, BuiltInGraphContext, Config>) {
    const [config, dispatch] = useReducer(reducer, props.config);
    const columnKeys = props.context.columns;

    const handleViewNameChanged = (name: string) => {
        dispatch({ type: ActionType.SET_WIDGET_NAME, name });
    };

    const handleAddColumn = useCallback(() => {
        dispatch({ type: ActionType.ADD_COLUMN });
    }, []);

    const handleRemoveColumn = useCallback((col: number) => {
        dispatch({ type: ActionType.REMOVE_COLUMN, col });
    }, []);

    const handleMoveColumn = useCallback((col: number, offset: number) => {
        dispatch({ type: ActionType.MOVE_COLUMN, col, offset });
    }, []);

    useEffect(() => {
        props.onChanged(config);   
    });

    return (
        <div className="ngraph-form">
            <div className="ngr-mb-2">
                <div className="ngr-field-label">Widget name</div>
                <TextInput value={config.widgetName} onChange={handleViewNameChanged}/>
            </div>
            <div>
                <div className="ngr-field-label">Columns</div>
                <ListInput
                    className="ngr-ml-2"
                    values={config.columns}
                    onAddItem={handleAddColumn}
                    onRemoveItem={handleRemoveColumn}
                    onMoveItem={handleMoveColumn}
                    renderItem={(col, idx) => (
                        <GridViewColumnConfig
                            column={col}
                            idx={idx}
                            columnKeys={columnKeys}
                            dispatch={dispatch}
                        />
                    )}
                />
            </div>
        </div>
    );
}
