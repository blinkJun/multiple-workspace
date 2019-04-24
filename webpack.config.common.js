const path = require('path');
const fs = require("fs")
const _ = require('lodash');


const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 页面配置
const {
    pagesDirPath,
    cachePackages,
    baseHtmlWebpackPluginOptions,
    viewsHtmlWebpackPluginOptions
} = require('./views.config.js'); 


function readDirHtmlListSync(pagesDirPath) {
    var pages = fs.readdirSync(pagesDirPath);
    var htmlList = []
    // 循环遍历当前的文件以及文件夹
    pages.forEach(function (ele, index) {
        const pageDirPath = pagesDirPath + "\\" + ele
        var info = fs.statSync(pageDirPath)
        if (info.isDirectory()) {
            const pageDirFileList = fs.readdirSync(pageDirPath);
            let chunksPaths = pageDirFileList.filter(item=>/\.js|\.ts/g.test(item))
            let htmlPaths  = pageDirFileList.filter(item=>/\.html|\.htm/g.test(item))
            let pageInfo = {};
            if(chunksPaths.length>0){
                pageInfo.chunks=chunksPaths.map(item=>{
                    let nameItems =  item.split('.')
                    nameItems.reverse().shift()
                    const name  = nameItems.join('')
                    return {
                        name:name,
                        path:pageDirPath+'\\'+item
                    }
                })
            }
            if(htmlPaths.length>0){
                const htmlIndex = htmlPaths[0]
                let pageNameItems =  htmlIndex.split('.')
                pageNameItems.reverse().shift()
                const pageName  = pageNameItems.join('')
                pageInfo.html={
                    name:htmlIndex,
                    pageName:pageName,
                    path:pageDirPath+'\\'+htmlIndex,
                }
            }
            htmlList.push(pageInfo)
        }
    })
    // 将html文件路径进行返回
    return htmlList
}
// 所有页面的脚本和html信息
let htmlList = readDirHtmlListSync(pagesDirPath);
// 输出page下所有的入口文件
let entry = {}
// 遍历baseViewsPath下的所有html文件，将html文件和上面的配置组合输出到webpack配置
const viewsHtmlWebpackPluginList = htmlList.map(item=>{
    const pageName = item.html.pageName
    item.chunks.forEach(item=>entry[item.name]=item.path)
    return new HtmlWebpackPlugin(Object.assign({
        template:item.html.path,
        filename:item.html.name,
        chunks:item.chunks.map(item=>item.name),
    },Object.assign(
        _.cloneDeep(baseHtmlWebpackPluginOptions),
        viewsHtmlWebpackPluginOptions[pageName]||{}
    )))
})
// 获取需要缓存的分离出来的第三方插件配置
const cacheGroups = {};
cachePackages.forEach(item=>{
    cacheGroups[item]={
        test:new RegExp(item),
        name: item,
        chunks: "all",
        minChunks :2 // 至少被引用2次的第三方包
    }
})


module.exports = {
    entry,
    output: {
        filename: 'js/[name].[hash].js',
        path: __dirname + '/dist'
    },
    resolve: {
        // 优先使用这些扩展名去处理引入的文件
        extensions: [".ts", ".tsx", ".js"],
        // 引入文件时可以使用的别名
        alias:{
            '@':path.resolve(__dirname, './src'),
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
        // 禁用ts-loader的类型检查，启用单独的进程进行类型检查
        new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
        ...viewsHtmlWebpackPluginList,
    ],
    // 打包分离来自node_modules的第三方包
    optimization:{
        splitChunks:{
            cacheGroups
        },
        runtimeChunk: {
            name: 'manifest'
        }
    },
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
                use: [
                    { loader: 'cache-loader' },
                    {
                        loader: 'thread-loader',
                        options: {
                            // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                            workers: require('os').cpus().length - 1,
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            happyPackMode: true // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
                        }
                    }
                ],
                exclude: /node_modules/,
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
            // 处理html内资源 与html-webpack-plugin的语法冲突，不再使用
            // {
            //     test: /\.html$/,
            //     use: {
            //         loader: 'html-loader'
            //     }
            // }
        ]
    }
}