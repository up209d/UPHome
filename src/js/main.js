import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from './components/app'
import appReducer from './reducers' // It automatically select the index.js inside the ./reducers folder

const store = createStore(appReducer);


ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App} />
        </Router>
    </Provider>,
    document.getElementById('root')
);

if (DEVELOPMENT) {
    module.hot.accept();
}