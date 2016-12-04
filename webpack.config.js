const path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');

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
            'tweenmax' : 'TM' // Mean tweenmax is external library, being used as a global var TweenMax
        },
        devtool: 'source-map',
        entry: {
            // The point of entry object is out multi bundle file which is one for your app and another for other plugin vendor
            // We split cuz we want to cache the vendor one cuz there s no point to reload that and it can save a lot of bandwidth
            appBundle: [
                './src/js/app.js',
                'webpack/hot/dev-server',
                'webpack-dev-server/client?http://localhost:20987/'
            ],
            vendorBundle: [
                'jquery'
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
                    loader: 'babel-loader',
                    exclude: [/node_modules/,/bower_components/]
                },
                {
                    test: /\.(png|jpg|gif|svg|tff|eot|woff|woff2)$/,
                    //Url loader will automatically fallback to fileloader if the file is large than 10000 bytes
                    loaders: [
                        'url-loader?limit=10000&name=[name].[ext]',
                        {
                            loader: 'image-webpack-loader',
                            query: {
                                progressive: true,
                                optimizationLevel: 7,
                                interlaced: false,
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
                    test: /\.(css|scss)$/,
                    // This will cause inline style so we should go with extract-text-webpack-plugin to move them to external file
                    loader: ExtractTextPlugin.extract({
                        fallbackLoader: 'style-loader',
                        loader: [
                            'css-loader?sourceMap&importLoader=1',
                            'postcss-loader',
                            'sass-loader?sourceMap',
                            'postcss-loader'
                        ]
                        // This loader order here means: firstly the scss file will be read by postcss-loader with parser and syntax postcss-scss(not compile)
                        // so the output will be still scss content, the purpose is to allow we can write cssnext syntax into scss syntax
                        // since sass doesnt except cssnext syntax so we have to use postcss-scss convert to normal scss file with prefixed and cssnext compiled
                        // sass will compile it to css -> this css file havent been prefixed (dont know why) so we have to pass it to posscss-loader again
                        // and postcss again will validate that and prefix that css file. Then complete css file will be output to cssloader
                    }),
                    exclude: [/node_modules/,/bower_components/]
                },
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new ExtractTextPlugin({
                filename: 'style.css'
            }),
            new webpack.optimize.UglifyJsPlugin({
                test: /\.jsx?$/,
                comment: true,
                compress: false,
                mangle: false,
                beautify: true,
                exclude: [/node_modules/,/bower_components/]
            }),
            // In order to inject the variable to other JS files have to use DefinePlugin
            new webpack.DefinePlugin({
                DEVELOPMENT : DEVELOPMENT,
                PRODUCTION  : !DEVELOPMENT
            }),
            new HTMLWebpackPlugin({
                //filename can be a full path /filename
                filename: 'index.html',
                // Template just work with no HTML Loader
                template: './src/index.html'
            })
        ],
        output: {
            path: path.resolve(__dirname, 'dist'),
            //Public path is very important for Hot Reload, if present the actual path of the output file,
            // in this case the server start inside 'dist' folder so the output file is in the 'dist' folder
            // so publicPath should be blank '' cuz it is in the folder.
            // for other exp: if the server start from root folder './' mean we have to go to localhost:port/dist folder to
            // access the output file so the Public Path have to be /dist/
            publicPath: '',
            filename: '[name].js'
        }

    }   :
    // For Production build
    {
        // We can include js library here that will request remotely by script src to CDN server like jquery cdn
        // syntax will be {'jquery': 'jQuery'} and you can import or require jquery normally in other js file
        // like you are having that as in vendorBundle
        externals: {
            'tweenmax' : 'TweenMax' // Mean tweenmax is external library, being used as a global var TweenMax
        },
        devtool: 'source-map',
        entry: {
            appBundle: [
                './src/js/app.js'
            ],
            vendorBundle: [
                'jquery'
            ]
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: ['babel-loader'],
                    exclude: [/node_modules/,/bower_components/]
                },
                {
                    test: /\.(png|jpg|gif|svg|tff|eot|woff|woff2)$/,
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
                    test: /\.scss$/,
                    // This will cause inline style so we should go with extract-text-webpack-plugin to move them to external file
                    loader: ExtractTextPlugin.extract({
                        fallbackLoader: 'style-loader',
                        loader: ['css-loader','sass-loader']
                    }),
                    exclude: [/node_modules/,/bower_components/]
                }
            ]
        },
        plugins: [
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
                exclude: [/node_modules/,/bower_components/]
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
