import React from 'react';

import './styles/app.scss';

// import '@fortawesome/fontawesome-free';
// import './fa';

// import 'normalize.css';
// import './styles/app.css';
// import './styles/resizer.css';
// import './styles/main.scss';
import GraphEditor from 'graph/editor/GraphEditor';
import { Graph } from 'graph/types/graphTypes';
import { graphConfig } from './config/graphConfig';

const INITIAL_GRAPH: Graph = {
    nodes: {
      'group': {
        type: 'group',
        fields: {},
        ports: {
          in: {},
          out: {}
        },
        x: 100,
        y: 100
      }
    }
}

export default function App() {
  return (
    <div className="app">
        <GraphEditor
          graphConfig={graphConfig}
          graph={INITIAL_GRAPH}
          onChanged={() => {}}
        />
    </div>
  );
}
