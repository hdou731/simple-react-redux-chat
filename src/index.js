import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as reducers from "./reducers";


const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    combineReducers(reducers),
    compose(
        applyMiddleware(sagaMiddleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ ?
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() :
            compose,
    )
);

const dispatch = store.dispatch;

ReactDOM.render(
    <Provider store={store}>
        <App store={store} dispatch={dispatch} saga={sagaMiddleware}/>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
