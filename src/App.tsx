import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Graph from './graph/components/Graph';
import { spec } from './graphSpec';

import '@fortawesome/fontawesome-free';
import './fa';

import 'normalize.css';
import './styles/app.css';
import './graph/styles/datagrid.css';
import './graph/styles/dropdown.css';
import './graph/styles/form.css';
import './graph/styles/main.scss';

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
