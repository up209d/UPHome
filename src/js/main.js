import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {createStore} from 'redux';

import App from './components/app'

const store = createStore(()=>{});

ReactDOM.render(
    <Provider store={store}>
        <App />

    </Provider>,
    document.getElementById('root')
);

if (DEVELOPMENT) {
    module.hot.accept();
}