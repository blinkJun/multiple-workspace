const path = require("path")

module.exports = {
    // 存放页面的文件夹路径
    pagesDirPath:path.resolve( __dirname, "./src/views" ),
    // 基础精灵图配置，更多相关配置可查看gulpfile.js
    sprites:{
        entry:path.resolve( __dirname, "./src/sprites/" ),
        outPut:{
            image:path.resolve( __dirname, './src/images' ),
            scss:path.resolve( __dirname, './src/style' ),
        },
        template:path.resolve( __dirname, './scss.template.mustache' ),
        baseImagesPath:'@/images/'
    },
    // 默认htmlWebpackPlugin配置
    baseHtmlWebpackPluginOptions:{
        favicon:path.resolve(__dirname,'./favicon.ico'),
        meta:{
            'a':{
                name:'apple-mobile-web-app-capable',
                content:'yes'
            },
        }
    },
    // 各个html页面可扩展的htmlwebpackPlugin配置
    viewsHtmlWebpackPluginOptions:{
        index:{
            meta:{
                'a':{
                    name:'apple-mobile-web-app-capable',
                    content:'no'
                },
            }
        },
        app:{
            meta:{
                'a':{
                    name:'apple-mobile-web-app-capable',
                    content:'no'
                },
            }
        }
    }
}