import React, { useReducer, useCallback } from 'react';
import { ConfigComponentProps } from "../../types/graphDefTypes";
import { BuiltInGraphParams, BuiltInGraphContext } from "../builtInNodeDefTypes";
import { Config } from "./gridWidgetNodeDef";
import { reducer, ActionType } from './reducer';
import Button from '../../components/common/Button';
import GridViewColumnConfig from './GridWidgetColumnConfig';
import FieldGroup from '../../components/common/form/FieldGroup';
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

    return (
        <>
            <div className="ngraph-modal-body">
                <div className="ngraph-form">
                    <FieldGroup label="Widget Name">
                        <TextInput value={config.widgetName} onChange={handleViewNameChanged} size="full"/>
                    </FieldGroup>
                    <FieldGroup label="Columns">
                        <ListInput
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
                    </FieldGroup>
                </div>
            </div>
            <div className="ngraph-modal-footer">
                <Button variant="secondary" onClick={props.onHide} label="Cancel"/>
                <Button variant="primary" onClick={() => props.onSave(config)} label="Apply Changes"/>
            </div>
        </>
    );
}
