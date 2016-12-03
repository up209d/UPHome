// Exp PostCSS config
// module.exports = (ctx) => ({
//     parser: ctx.sugar ? 'sugarss' : false,
//     map: ctx.env === 'development' ? ctx.map : false,
//     from: ctx.from
//     to: ctx.to
//     plugins: {
//         'postcss-plugin': ctx.plugin
//     }
// })
// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
    parser: 'postcss-scss',
    syntax: 'postcss-scss',
    map: 'inline',
    plugins: {

        // autoprefixer already inside postcss-cssnext so we dont need it here
        //'autoprefixer': {},
        'postcss-cssnext': {}
    }
};

// Another solution
// // ** Important **
// var postCSS = require('postcss');
//
// // Basically the config file is exactly what we did with the webpack.config.js
// // We have to import postcss first and then module.exports = {}
//
// // Those below are plugins so we have to put inside plugin object
// var autoPrefixer = require('autoprefixer');
//
// var cssNext = require("postcss-cssnext");
//
// module.exports = {
//     plugins: [
//         new autoPrefixer()
//     ]
// };




