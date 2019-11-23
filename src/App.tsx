import React from 'react';
import { Provider } from 'react-redux';
import SplitPane from 'react-split-pane';

import { store } from './store/store';
import { spec } from './data/graphSpec';
import Graph from './editor/components/Graph';
import Chart from './chart/components/Chart';

import '@fortawesome/fontawesome-free';
import './fa';

import 'normalize.css';
import './styles/app.css';
import './styles/resizer.css';
import './styles/main.scss';

export default function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <SplitPane split="vertical" minSize={100} defaultSize={300} primary="second">
          <Graph graphId="graph-1" spec={spec}/>
          <Chart graphId="graph-1"/>
        </SplitPane>
      </div>
    </Provider>
  );
}
