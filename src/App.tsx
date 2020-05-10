import React from 'react';
import Editor from './components/Editor';
import { GraphDef } from './types/graphDefTypes';
import { builtInGraphNodes } from './nodes/builtInNodeDefs';
import { BuiltInGraphParams, BuiltInGraphContext } from './nodes/builtInNodeDefTypes';
import { initialGraph } from './data/initialGraph';

import './index.css';
import './styles/main.scss';
import 'react-data-grid/dist/react-data-grid.css';

const graphDef: GraphDef<BuiltInGraphParams, BuiltInGraphContext> = {
  nodes: builtInGraphNodes
};

function App() {
  return (
    <div className="App">
      <Editor
        graph={initialGraph}
        graphDef={graphDef}
        params={{
          variables: {}
        }}
        
      />
    </div>
  );
}

export default App;
