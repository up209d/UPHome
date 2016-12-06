require ("../scss/app.scss");

var $ = require ("jquery");
var trianglify = require("trianglify");
var TweenMax = require("./vendor/gsap/TweenMax.min");

const path = require("path");
var logs = require("./modules/logs");

var content = document.getElementById("app");
content.innerHTML = `<h1>Dev: ${DEVELOPMENT} <span>Pro: ${PRODUCTION}</span></h1><p class="box">I am custom class which is ${logs.message}</p>`;

if (DEVELOPMENT) {
    module.hot.accept();
}