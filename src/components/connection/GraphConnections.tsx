import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { selectGraphConnections, selectPortDrag } from '../../redux/editorSelectors';
import { Connection } from '../../types/graphTypes';
import GraphDragConnection from './GraphDragConnection';
import { StoreState } from '../../types/storeTypes';
import GraphConnection from './GraphConnection';

function connectionToKey(conn: Connection) {
    return conn.outNode + '__' + conn.outPort + '__' + conn.inNode + '__' + conn.inPort;
}

function GraphConnections() {
    const { connections, portDrag } = useSelector((state: StoreState) => ({
        connections: selectGraphConnections(state),
        portDrag: selectPortDrag(state)
    }), shallowEqual);
    
    return (
        <>
            {connections.map((connection) => (
                <GraphConnection
                    key={connectionToKey(connection)}
                    connection={connection}
                />
            ))}
            {portDrag && (
                <GraphDragConnection
                    portDrag={portDrag}
                />
            )}
        </>
    );
}

export default React.memo(GraphConnections);
