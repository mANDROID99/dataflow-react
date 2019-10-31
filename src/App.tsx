import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import GraphContainer from './GraphContainer';
import { spec } from './graphSpec';

import '@fortawesome/fontawesome-free';

import './styles/app.css';
import './graph/styles/graph.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <GraphContainer graphId="graph-1" spec={spec}/>
      </div>
    </Provider>
  );
}

export default App;
