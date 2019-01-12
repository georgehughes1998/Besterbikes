import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'

import Firebase, { FirebaseContext } from './components/Firebase'

import App from "./components/App";
import reducers from "./reducers";

//Hooks up Redux development tool
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//Redux store for storing state across the app
const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware())
);

//Renders App component
ReactDOM.render(
    // Wraps it inside FirebaseConext Provider for UI to access to firebase
    <FirebaseContext.Provider value={new Firebase()}>
        {/*Wraps inside Provider for Redux to store and handle state of App*/}
        <Provider store={store}>
            <App/>
        </Provider>
    </FirebaseContext.Provider>,
    document.querySelector('#root')
);

