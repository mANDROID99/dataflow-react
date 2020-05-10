import React from 'react';
import { useSelector } from 'react-redux';
import { Connection } from '../../types/graphTypes';
import { selectPortPos, PortPos, comparePortPos } from '../../redux/editorSelectors';
import { StoreState } from '../../types/storeTypes';
import { plotConnection, plotArrow } from './plot';

type ConnectionProps = {
    connection: Connection;
}

type SelectedState = {
    source: PortPos | undefined;
    target: PortPos | undefined;
}

function stateSelector(connection: Connection) {
    const { outNode, outPort, inNode, inPort } = connection;
    const selectSourcePort = selectPortPos(outNode, outPort, true)
    const selectTargetPort = selectPortPos(inNode, inPort, false)

    return (state: StoreState): SelectedState => ({
        source: selectSourcePort(state),
        target: selectTargetPort(state)
    });
}

function compareSelectedState(prev: SelectedState, next: SelectedState) {
    return comparePortPos(prev.source, next.source) && comparePortPos(prev.target, next.target);
}


function GraphConnection({ connection }: ConnectionProps) {
    const { source, target } = useSelector(stateSelector(connection), compareSelectedState);

    if (!source || !target) {
        return null;
    }

    const dConn = plotConnection(source, target.x, target.y, target.align);
    const dArrow = plotArrow(source, target);
    return <>
        <path className="ngraph-connection" d={dConn}/>
        <path className="ngraph-connection-arrow" d={dArrow}/>
    </>
}

export default React.memo(GraphConnection);
