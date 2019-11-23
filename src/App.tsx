import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Graph from './editor/components/Graph';
import { spec } from './data/graphSpec';

import '@fortawesome/fontawesome-free';
import './fa';

import 'normalize.css';
import './styles/app.css';
import './editor/styles/main.scss';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <Graph graphId="graph-1" spec={spec}/>
      </div>
    </Provider>
  );
};

export default App;
