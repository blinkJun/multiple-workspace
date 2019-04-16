const fs = require("fs")
const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const _ = require('lodash')

const basePagesDir = "./src/pages"

const pagesDirPath = path.resolve( __dirname, basePagesDir );
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
    // 将html文件路径立碑进行返回
    return htmlList
}
// 所有页面的脚本和html信息
let htmlList = readDirHtmlListSync(pagesDirPath);


// 默认htmlWebpackPlugin配置
const beseHtmlWebpackPluginOptions = {
    favicon:path.resolve(__dirname,'./favicon.ico'),
    meta:{
        'apple-mobile-web-app-capable':{
            content:'yes'
        },
    }
}

// 各个html页面可扩展的htmlwebpackPlugin配置
const viewsHtmlWebpackPluginOptions = {
    index:{
        meta:{
            'apple-mobile-web-app-capable':{
                content:'noo'
            },
        }
    },
    app:{
        meta:{
            'apple-mobile-web-app-capable':{
                content:'no'
            },
        }
    }
}


// 输出page下所有的入口文件
// 遍历baseViewsPath下的所有html文件，将html文件和上面的配置组合输出到webpack配置
let entry = {}
const viewsHtmlWebpackPluginList = htmlList.map(item=>{
    const pageName = item.html.pageName
    item.chunks.forEach(item=>entry[item.name]=item.path)
    return new HtmlWebpackPlugin(Object.assign({
        template:item.html.path,
        filename:item.html.name,
        chunks:item.chunks.map(item=>item.name),
    },Object.assign(
        _.cloneDeep(beseHtmlWebpackPluginOptions),
        viewsHtmlWebpackPluginOptions[pageName]||{}
    )))
})

module.exports = {
    viewsHtmlWebpackPluginList,
    entry
}