import React from 'react';
import ReactDOM from 'react-dom';
// import '../public/css/style.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// redux
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducers from './reducers';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

ReactDOM.render(
    <Provider store={
                      createStore(reducers,
                      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )}>
        <App />
    </Provider>,
  document.querySelector('#root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
