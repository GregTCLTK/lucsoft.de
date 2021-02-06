const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');

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

module.exports = (_, mode) =>
{
    const isProduction = (typeof mode.env.production === "boolean" && mode.env.production);
    return {
        entry: {
            main: "./src/index.ts",
            './p/hangman': "./src/p/hangman/index.ts",
            './p/hmsys': "./src/p/hmsys/index.ts",

        },
        mode: isProduction ? "production" : "development",
        output: {
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
                    test: /\.(png|jpe?g|gif)$/i,
                    use: 'file-loader'
                },
                {
                    test: /\.ts$/,
                    loader: "ts-loader"
                },
                {
                    test: /\.css$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        'css-loader'
                    ]
                },
                {
                    test: /\.svg$/i,
                    use: 'url-loader'
                }
            ]
        },
        devServer: {
            contentBase: "./dist",
            port: 80,
            host: '0.0.0.0'
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),
            createPage('index', [ 'main' ]),
            createPage('./p/imprint', [], './src/p/imprint.html'),
            createPage('./p/hangman', [ './p/hangman' ])
        ],
        optimization: isProduction ? {
            minimize: true,
            minimizer: [ new TerserPlugin(), new CssMinimizerPlugin() ]
        } : undefined
    }
};