const fs = require("fs")
const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const _ = require('lodash')
const baseViewsPath = "./src/views/"
const viewsPath = path.resolve(__dirname, baseViewsPath );
function readDirHtmlListSync(path) {
    var pa = fs.readdirSync(path);
    var htmlList = []
    // 循环遍历当前的文件以及文件夹
    pa.forEach(function (ele, index) {
        var info = fs.statSync(path + "\\" + ele)
        if (info.isDirectory()) {
            // 暂不处理深层文件夹内的文件
            readDirSync(path + "\\" + ele);
        } else {
            var filePath = path + '\\' + ele;
            // 找到 .html文件
            let fileNameReg = /\.html|\.htm/g;
            let shouldFormat = fileNameReg.test(filePath);
            if (shouldFormat) {
                // 将拿到的html路径推送到列表
                htmlList.push({
                    path:filePath,
                    filename:ele
                })
            }
        }
    })
    // 将html文件路径立碑进行返回
    return htmlList
}




let htmlList = readDirHtmlListSync(viewsPath);

const beseHmtlWebpackPluginOptions = {
    favicon:path.resolve(__dirname,'./favicon.ico'),
    meta:{
        'apple-mobile-web-app-capable':{
            content:'yes'
        },
    }
}

// 各个html的htmlwebpackPlugin配置
const viewsHtmlWebpackPluginOptions = {
    index:Object.assign(_.cloneDeep(beseHmtlWebpackPluginOptions),{
        chunks:['index']
    }),
    app:Object.assign(_.cloneDeep(beseHmtlWebpackPluginOptions),{
        chunks:['app']
    })
}

// 遍历baseViewsPath下的所有html文件，将html文件和上面的配置组合输出到webpack配置
const viewsHtmlWebpackPluginList = htmlList.map(item=>{
    let nameItems =  item.filename.split('.')
    nameItems.reverse().shift()
    const name  = nameItems.join('')
    return new HtmlWebpackPlugin(Object.assign({
        template:baseViewsPath+item.filename,
        filename:item.filename,
        chunks:[''],
    },viewsHtmlWebpackPluginOptions[name]||{}))
})


module.exports = viewsHtmlWebpackPluginList