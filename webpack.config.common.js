const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const viewsHtmlWebpackPluginList = require('./views.config.js'); 
module.exports = {
    entry: {
        index: './src/scripts/index.ts',
        app:'./src/scripts/app.ts'
    },
    output: {
        filename: 'js/[name].[hash].js',
        path: __dirname + '/dist'
    },
    resolve: {
        // 优先使用这些扩展名去处理引入的文件
        extensions: [".ts", ".tsx", ".js"],
        // 引入文件时可以使用的别名
        alias:{
            '@':path.resolve(__dirname, './src/'),
        }
    },
    plugins:[
        // 清理掉输出文件夹
        new CleanWebpackPlugin(),
        // 复制图标
        new CopyWebpackPlugin([
            {
                from:'./favicon.ico',
                to:'./'
            }
        ]),
        ...viewsHtmlWebpackPluginList,
    ],
    module: {
        rules: [
            // css
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader:'postcss-loader'
                    },
                    {
                        loader: 'css-loader',
                    }
                ]
            },
            // 处理脚本文件
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            },
            // 处理图片资源
            {
                test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'img/[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            // 处理媒体文件
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use:[
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'media/[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            // 处理字体资源
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            // 处理html内资源
            // {
            //     test: /\.html$/,
            //     use: {
            //         loader: 'html-loader'
            //     }
            // }
        ]
    }
}