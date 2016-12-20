require ("../scss/app.scss");

var React = require('react');
var ReactDOM = require('react-dom');

import Store from 'redux';

console.log(Store);

ReactDOM.render(
    <div className="box">
        <h1>Hello, <span>Man!</span></h1>
    </div>,
    document.getElementById('root')
);

if (DEVELOPMENT) {
    module.hot.accept();
}