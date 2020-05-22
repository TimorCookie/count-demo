import React from 'react';
import './App.css';

import store from './react-redux/store'
import { Provider } from 'react-redux'
import CountButton from './components/CountButton'
import CountNum from './components/CountNum'
function App() {
  return (
    <Provider store={ store }>
      <div className="App">
        <CountButton />
        <CountNum />
      </div>
    </Provider>
  );
}

export default App;
