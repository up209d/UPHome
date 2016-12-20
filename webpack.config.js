const path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');

// Define folder node_modules bower_components local vendor js folder (src/js/vendor)
var node_path = path.resolve(__dirname,"node_modules");
var bower_path = path.resolve(__dirname,"bower_components");
var vendor_path = path.join(__dirname,"src","js","vendor");

// Get Host Config Data
var host = require("./host.config");
var hostLocalAccess = "http://" + host.hostName+":"+host.hostPort;
var hostNetworkAccess = "http://" + host.hostLanIP+":"+host.hostPort;

// console.log(hostNetworkAccess);

//process.env.NODE_ENV only work on server side mean, you cannot use that in client side
//In window the string of NODE_ENV is freak, should just use sub string
var status = process.env.NODE_ENV ? process.env.NODE_ENV.substr(0,3) : 'pro';
var DEVELOPMENT = status === 'dev';

var caseModule = DEVELOPMENT ?
    // For Development build
    {
        // We can include js library here that will request remotely by script src to CDN server like jquery cdn
        // syntax will be {'jquery': 'jQuery'} and you can import or require jquery normally in other js file
        // like you are having that as in vendorBundle
        externals: {
            // You have to add the CDN Linking to the Index.html manually as it is external library
            // 'tweenmax' : 'TM' // Mean tweenmax is external library, being used as a global var TweenMax
        },
        devtool: 'source-map',
        entry: {
            // The point of entry object is out multi bundle file which is one for your app and another for other plugin vendor
            // We split cuz we want to cache the vendor one cuz there s no point to reload that and it can save a lot of bandwidth
            // each entry name will output to one js file with chunk hash (see output)
            // One entry can contain as many file as they are listed in
            appBundle: [
                './src/js/main.js',
                'webpack/hot/dev-server',
                'webpack-dev-server/client?'+hostNetworkAccess+'/' // 'webpack-dev-server/client?http://192.168.1.79:20987/'
                // 'webpack-dev-server/client?http://localhost:20987/'
            ],
            //Vendor Bundle will contain any library which is node module or bower component or self define library as well
            // as the library which is not a node module, for exp: './src/js/vendor/gsap/TweenMax.min.js'
            // Everytime in client js when we require the library we have to declare it also here to let webpack put it in
            // vendorBundle.js after packing
            vendorBundle: [
                // Becareful all vendor file will be included in here even it is not used (reuire,import) in any js file
                // So the size of vendorBundle will be quite large
                'react','react-dom',
                // './src/js/vendor/gsap/TweenMax.min.js',
                // 'jquery',
                // 'trianglify',
                // This is d3 which is resloved from bower_components in resolve section, see below
                // 'd3'
            ]
        },
        module: {
            // Preloaders is no longer in new Webpack, just use the loaders
            //preLoaders: [] now turn to enforce: 'pre', so on postLoaders => enforce: 'post'
            loaders: [
                // {
                //     // Javascript with js ext or jsx ext
                //     enforce: 'pre',
                //     test: /\.jsx?$/,
                //     loader: ['eslint-loader'],
                //     exclude: [/node_modules/,/bower_components/]
                // },
                {
                    // Javascript with js ext or jsx ext
                    test: /\.jsx?$/,
                    loader: ['react-hot-loader','jsx-loader','babel-loader'],
                    exclude: [/node_modules/,/bower_components/]
                },
                {
                    test: /\.json$/,
                    loader: ['json-loader'],
                    // Json loader has to access to the json file from node_modules or bower_component
                    // so the exclude is useless
                    // exclude: [/node_modules/,/bower_components/]
                },
                {
                    test: /\.(png|jpg|gif|svg|tff|eot|woff|woff2|ico)$/,
                    //Url loader will automatically fallback to fileloader if the file is large than 10000 bytes
                    loaders: [
                        'url-loader?limit=10000&name=[name].[ext]',
                        {
                            loader: 'image-webpack-loader',
                            query: {
                                progressive: true,
                                optimizationLevel: 7,
                                interlaced: false,
                                gifsicle: {
                                    interlaced: false,
                                    optimizationLevel: 3
                                },
                                mozjpeg: {
                                    quality: 70
                                },
                                pngquant: {
                                    quality: '60-90',
                                    speed: 4
                                }
                            }
                        }
                    ],
                    exclude: [/node_modules/,/bower_components/]
                },
                {
                    // Extract Text Plugin doesnt like Hot Reload so if we use it in dev. hot reload cannot do anything when a scss or css file changed
                    // It s not nessesary to use extractTextPlugin in dev environment since we just need the style inline inject to HTML files with sourceMap, that is enough
                    // Another problem is cssLoader with SourceMap doesn't like background Image which use relative url
                    // This can be easily fix by defined the public Path in dev-server.js (see dev-server.js in order to understand) as an exact host name and port, for exp: 0.0.0.0:20987
                    // Which the public path is fixed, there wont be any problem with relative URL - backgroundImage
                    test: /\.(css|scss)$/,
                    loaders: ["style-loader","css-loader?sourceMap","postcss-loader","sass-loader?sourceMap&sourceMapContents","postcss-loader"],
                    exclude: [/node_modules/,/bower_components/]
                    // We also dont have to worry about production part because, in that part ExtractTextPlugin will be fine with output style.css and we dont need SourceMap so
                    // there wont be problem with relative URL background image as well, we also dont need hot Reload so no difficulty
                }
            ]
        },
        //Normally Webpack doesnt like Bower and it realize none of bower dependency as dependency so we have to tell Webpack
        // about that manually, resolver is some kind of that function, not only for bower but for many thing else like non-module library like TimelineMax
        // after doing that we can require or import those library as normal as node dependency
        // We can also use this way to define a part of library, for exp : we only want TweenLite from GSAP
        resolve: {
            modules: ["bower_components","node_modules","./src/js/vendor"],
            // Which line in the dependency should Webpack look inside package.json bower.json
            mainFields: ["browser","module","main"],
            // Note: bower.json doesnt work so have to use .bower.json here, i dont know why
            descriptionFiles: [".bower.json","package.json"],
            alias: {
                "TimelineMax": path.join(vendor_path, "/gsap/TimelineMax.min.js"),
                "TweenLite": path.join(node_path, "/gsap/src/minified/TweenLite.min.js"),
                "TimelineLite": path.join(vendor_path, "/gsap/TimelineLite.min.js"),
                "TweenMax": path.join(node_path, "/gsap/src/minified/TweenMax.min.js"),
                // Import all bower components ("d3" above in entry vendorBundle is import from this line)
                "bower": bower_path
            }
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            // Import Jquery or any library Globally
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery"
            }),
            new webpack.optimize.UglifyJsPlugin({
                test: /\.jsx?$/,
                comment: true,
                compress: false,
                mangle: false,
                beautify: true,
                // exclude: [/node_modules/,/bower_components/]
            }),
            // In order to inject the variable to other JS files have to use DefinePlugin
            new webpack.DefinePlugin({
                DEVELOPMENT : DEVELOPMENT,
                PRODUCTION  : !DEVELOPMENT
            }),
            new HTMLWebpackPlugin({
                // Inject Fav Icon here, for advance use https://github.com/jantimon/favicons-webpack-plugin
                // Otherwise it s not important to put icon file here instead of use data uri directly to HTML Template
                // since the icon file is small so using data:URI is better way, use online converter to convert ico to data URI
                // favicon: './src/assets/favicon.ico',
                //filename can be a full path /filename
                filename: 'index.html',
                // Template just work with no HTML Loader
                template: './src/index.html'
            })
        ],
        output: {
            path: path.resolve(__dirname, 'dist'),
            // Public path is very important for Hot Reload, if present the actual path of the output file,
            // in this case the server start inside 'dist' folder so the output file is in the 'dist' folder
            // so publicPath should be blank '' cuz it is in the folder.
            // for other exp: if the server start from root folder './' mean we have to go to localhost:port/dist folder to
            // access the output file so the Public Path have to be /dist/

            // Remember *** IMPORTANT *** in pulic path we have to end up with "/" like localhost:20987/ or "/dist/" as when it add to relative url
            // it will not automatically add / to the url for exp: (images/abc.png) => localhost:20987images/abc.png

            // Public Path for Server can be a Local Access (http://localhost:20987/) or Network Access (http://192.168.1.14:20987)
            // Because if you set Absolute PublicPath you have to use that in order for browser can get all files correctly
            // For exp: if you use localhost and you access 192.168.1.12 in browser, it will not receive any image file since the domain is not correct to the publicPath (localhost)
            // Normally you will use hostLocalAccess but if you want someone in network connect to your project you should change to the hostNetworkAccess one (192.168.1...)
            // By doing that you also have to work with the domain of network ip 192.168.1... on your browser to get everything correct. Everytime when your Lan IP changed, you have to
            // access by the new IP again, that resolve by get the lan ip automatically by npm install --save-dev get-local-ip (see host.config.js to clear about it)
            publicPath: hostNetworkAccess + '/',
            filename: '[name].js'
        }

    }

    :

    // For Production build
    {
        // We can include js library here that will request remotely by script src to CDN server like jquery cdn
        // syntax will be {'jquery': 'jQuery'} and you can import or require jquery normally in other js file
        // like you are having that as in vendorBundle
        externals: {
            // 'tweenmax' : 'TweenMax' // Mean tweenmax is external library, being used as a global var TweenMax
        },
        entry: {
            appBundle: [
                './src/js/main.js'
            ],
            vendorBundle: [
                // Becareful all vendor file will be included in here even it is not used (reuire,import) in any js file
                // So the size of vendorBundle will be quite large
                'react','react-dom',
                './src/js/vendor/gsap/TweenMax.min.js',
                'jquery',
                'trianglify',
                // This is d3 which is resloved from bower_components in resolve section, see below
                'd3'
            ]
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loader: ['jsx-loader','babel-loader'],
                    exclude: [/node_modules/,/bower_components/]
                },
                {
                    test: /\.json$/,
                    loader: ['json-loader'],
                    // Json loader has to access to the json file from node_modules or bower_component
                    // so the exclude is useless
                    // exclude: [/node_modules/,/bower_components/]
                },
                {
                    test: /\.(png|jpg|gif|svg|tff|eot|woff|woff2|ico)$/,
                    //Url loader will automatically fallback to fileloader if the file is large than 10000 bytes
                    loaders: [
                        'url-loader?limit=10000&name=[hash].[ext]',
                        {
                            loader: 'image-webpack-loader',
                            query: {
                                progressive: true,
                                optimizationLevel: 7,
                                interlaced: false,
                                gifsicle: {
                                    interlaced: false,
                                    optimizationLevel: 3
                                },
                                mozjpeg: {
                                    quality: 70
                                },
                                pngquant:{
                                    quality: "65-90",
                                    speed: 3
                                },
                                svgo:{
                                    plugins: [
                                        {
                                            removeViewBox: false
                                        },
                                        {
                                            removeEmptyAttrs: false
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    exclude: [/node_modules/,/bower_components/]
                },
                {
                    test: /\.(css|scss)$/,
                    // This will cause inline style so we should go with extract-text-webpack-plugin to move them to external file
                    loader: ExtractTextPlugin.extract({
                        fallbackLoader: 'style-loader',
                        loader: [
                            'css-loader?importLoader=1',
                            'postcss-loader',
                            'sass-loader',
                            'postcss-loader']
                    }),
                    exclude: [/node_modules/,/bower_components/]
                }
            ]
        },
        //Normally Webpack doesnt like Bower and it realize none of bower dependency as dependency so we have to tell Webpack
        // about that manually, resolver is some kind of that function, not only for bower but for many thing else like non-module library like TimelineMax
        // after doing that we can require or import those library as normal as node dependency
        // We can also use this way to define a part of library, for exp : we only want TweenLite from GSAP
        resolve: {
            modules: ["bower_components","node_modules","./src/js/vendor"],
            // Which line in the dependency should Webpack look inside package.json bower.json
            mainFields: ["browser","module","main"],
            // Note: bower.json doesnt work so have to use .bower.json here, i dont know why
            descriptionFiles: [".bower.json","package.json"],
            alias: {
                "TimelineMax": path.join(vendor_path, "/gsap/TimelineMax.min.js"),
                "TweenLite": path.join(node_path, "/gsap/src/minified/TweenLite.min.js"),
                // Import all bower components ("d3" above in entry vendorBundle is import from this line)
                "bower": bower_path
            }
        },
        plugins: [
            // Import Jquery or any library Globally
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery"
            }),
            new ExtractTextPlugin({
                // app.scss and app.js has same chunk hash that why instead of use chunk hash for the change of js
                // we use content hash for hash changing everytime the content inside has changed
                filename: 'style.[contenthash:16].css'
            }),
            new webpack.optimize.UglifyJsPlugin({
                test: /\.jsx?$/,
                comment: false,
                compress: true,
                mangle: true,
                sourceMap: false,
                // exclude: [/node_modules/,/bower_components/]
            }),
            new webpack.DefinePlugin({
                DEVELOPMENT : DEVELOPMENT,
                PRODUCTION  : !DEVELOPMENT
            }),
            // Normal the js runtime will extract to the vendorBundle one, we want to seperate the runtime
            // cuz the runtime also can be changed when appBundle is changed, thus vendorBundle hash change as a consequence
            // that why this plugin will help extract the runtime out of the vendorBundle so the big file vendorBundle hash
            // will be change more effective, it will change when it is really change not because of the runtime inside
            // the caching will be much more accurate by doing this way
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendorBundle','manifest']
            }),
            new HTMLWebpackPlugin({
                // Inject Fav Icon here, for advance use https://github.com/jantimon/favicons-webpack-plugin
                // Otherwise it s not important to put icon file here instead of use data uri directly to HTML Template
                // since the icon file is small so using data:URI is better way
                // favicon: './src/assets/favicon.ico',
                //filename can be a full path /filename
                filename: 'index.html',
                // Template just work with no HTML Loader
                template: './src/index.html'
            })
        ],
        output: {
            path: path.resolve(__dirname, 'dist'),
            //Because when we upload to real server, we put every file in the root folder
            // for exp : domain.com/ so files are in the root folder, so publicPath should be blank,
            // but if we put in domain.com/app/ so files are in app folder, so publicPath shouw be /app/
            publicPath: '',
            filename: '[name].[chunkhash].js'
        }

    };

module.exports = caseModule;
