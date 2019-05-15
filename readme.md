## 一个多html文件前端开发环境目录

1. 多个html入口，非单页面应用程序；
2. 热替换，或者修改代码后自动刷新浏览器；
3. css预处理，前缀添加，压缩，url添加版本信息，独立css文件；
4. js预处理（ts=>es6=>es5），压缩；
5. 使用gulp单独生成精灵图片和图标样式scss
6. 压缩打包完成后的图片

## 使用方式

### 修改为自己的git目录

##### 下载裸版本库
    git clone --bare git://github.com/username/project.git
##### 推送到自己创建的版本库
    cd project.git
    git push --mirror git@gitcafe.com/username/newproject.git
##### 删除本地代码
    cd ..
    rm -rf project.git
##### 下载自己创建的版本库
    git clone git@gitcafe.com/username/newproject.git

#### 或者在推送前把推送的目标地址改为自己的仓库地址
    git remote set-url origin git@gitcafe.com/username/newproject.git
 
## 页面打包约定
    
1. 最基础的打包配置可查看和修改根目录下的views.config.js,更具体的webpack配置可查看根目录下的三个配置文件
2. html的打包方式为根据views.config.js内的页面目录查询目录内的所有文件夹，以文件夹名称作为页面名称，文件夹内首个html作为模板，文件夹内所有ts,js文件将会被打包引入页面
3. 在js，ts中引入样式文件后会被自动打包引入html文件中

## 提取第三方包约定
    
1. 需要提取第三方包为独立的js文件插入页面，需要在views.config.js中配置cachePackages，在js,ts引入这个同名包时，打包的时候会将他单独打包嵌入页面

## 精灵图打包约定

1. 精灵图打包使用gulp打包，方式类似html打包，可以在views.config.js配置精灵图的几个简单配置
2. 打包会根据入口目录查询目录下的所有文件夹，文件夹下的所有图片将被打包成为一个以文件夹名称命名的精灵图和一张以template生成的样式表
3. 精灵图和样式表会输出到对应目录，然后就可以在样式表中引用，使用。



## 环境启动
#### 启动开发环境
`npm run serve`

#### 启动开发环境并自动打开浏览器
`npm run start`

#### 将sprite文件夹下各个文件夹内的图标作为一张精灵图生成，放置到images和style页面
`npm run sprite`

#### 打包
`npm run build`

#### 压缩打包后的图片
`npm run minImages`
    