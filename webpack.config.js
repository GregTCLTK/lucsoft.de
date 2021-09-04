const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const createPage = (pagePath, chunks = [], template = "./src/index.html") =>
    new HtmlWebpackPlugin({
        inject: 'body',
        chunks: chunks,
        template: template,
        filename: pagePath + '.html',
        publicPath: '/',
        minify: {
            minifyCSS: true,
            minifyJS: true,
            removeComments: true,
            collapseWhitespace: true
        }
    })

module.exports = (_, mode) => {
    const isProduction = (typeof mode.env.production === "boolean" && mode.env.production);
    const generateProfile = (typeof mode.env.generateprofile === "boolean" && mode.env.generateprofile);

    return {
        entry: {
            main: "./src/pages/landing/index.ts",
            './p/hangman': "./src/pages/hangman/index.ts",
            './p/hmsys': "./src/pages/hmsys/index.ts",
            './p/imprint': "./src/pages/imprint/index.ts",
            './p/account': "./src/pages/account/index.ts"
        },
        mode: isProduction ? "production" : "development",
        output: {
            publicPath: '/',
            filename: '[name].js',
            chunkFilename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        resolve: {
            extensions: [ ".js", ".ts" ]
        },
        module: {
            rules: [
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    loader: 'file-loader',
                    options: {
                        name: '[hash:hex:4].[ext]',
                    }
                },
                {
                    test: /\.ts$/,
                    loader: "ts-loader"
                },
                {
                    test: /\.css$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                }
            ]
        },
        devServer: {
            port: 8080,
            host: 'localhost'
        },
        plugins: [
            ...(generateProfile ? [ new BundleAnalyzerPlugin() ] : []),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),
            createPage('index', [ 'main' ]),
            createPage('./p/imprint', [ './p/imprint' ]),
            createPage('./p/hangman', [ './p/hangman' ]),
            createPage('./p/hmsys', [ './p/hmsys' ]),
            createPage('./p/account', [ './p/account' ]),
        ],
        optimization: isProduction ? {
            minimize: true,
            minimizer: [ new TerserPlugin(), new CssMinimizerPlugin() ],
            splitChunks: {
                chunks: 'async',
                maxAsyncRequests: 30,
                maxInitialRequests: 30
            }
        } : undefined
    }
};