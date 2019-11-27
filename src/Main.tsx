import React from 'react';
import SplitPane from 'react-split-pane';
import { useSelector, useDispatch } from 'react-redux';

import { graphSpec, ChartContext } from './data/graphConfig';
import Chart from './chart/components/Chart';
import Graph from './editor/components/GraphEditor';
import { selectSplitSize } from './store/appSelectors';
import { resizeSplitPane } from './store/appActions';

const CONTEXT: ChartContext = {
    properties: [
        'x',
        'y'
    ]
}

export default function Main() {
    const splitSize = useSelector(selectSplitSize);
    const dispatch = useDispatch();

    const handleSizeChanged = (newSize: number): void => {
        dispatch(resizeSplitPane(newSize));
    }

    return (
        <div className="App">
            <SplitPane split="vertical" minSize={100} defaultSize={splitSize} primary="second" onChange={handleSizeChanged}>
                <Graph graphId="graph-1" graphSpec={graphSpec} context={CONTEXT}/>
                <Chart graphId="graph-1" splitSize={splitSize}/>
            </SplitPane>
        </div>
    );
}
