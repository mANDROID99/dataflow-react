import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Main from './Main';

import '@fortawesome/fontawesome-free';
import './fa';

import 'normalize.css';
import './styles/app.css';
import './styles/resizer.css';
import './styles/main.scss';

export default function App() {
  return (
    <Provider store={store}>
      <Main/>
    </Provider>
  );
}
