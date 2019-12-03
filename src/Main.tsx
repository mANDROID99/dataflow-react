import React from 'react';
import SplitPane from 'react-split-pane';
import { useSelector, useDispatch } from 'react-redux';

import { graphConfig } from './data/graphConfig';
import Chart from './chart/components/Chart';
import Graph from './editor/components/GraphEditor';
import { selectSplitSize } from './store/appSelectors';
import { resizeSplitPane } from './store/appActions';
import { ChartContext } from './processor/nodes/context';

const CONTEXT: ChartContext = {
    base: {
        properties: [
            'x',
            'y'
        ]
    },
    columns: [],
    keys: []
};

export default function Main() {
    const splitSize = useSelector(selectSplitSize);
    const dispatch = useDispatch();

    const handleSizeChanged = (newSize: number): void => {
        dispatch(resizeSplitPane(newSize));
    }

    return (
        <div className="App">
            <SplitPane split="vertical" minSize={100} defaultSize={splitSize} primary="second" onChange={handleSizeChanged}>
                <Graph graphId="graph-1" graphConfig={graphConfig} baseContext={CONTEXT}/>
                <Chart graphId="graph-1" graphConfig={graphConfig} baseContext={CONTEXT} splitSize={splitSize}/>
            </SplitPane>
        </div>
    );
}
