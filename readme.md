## 一个多html文件前端开发环境目录

    1. 多个html入口，非单页面应用程序；
    2. 热替换，或者修改代码后自动刷新浏览器；
    3. css预处理，前缀添加，压缩，url添加版本信息，独立css文件；
    4. js预处理（ts=>es6=>es5），压缩；
    5. 使用gulp单独生成精灵图片和图标样式scss

### 使用方式

#### 启动开发环境
`npm run serve`

#### 启动开发环境并自动打开浏览器
`npm run start`

#### 将sprite文件夹下各个文件夹内的图标作为一张精灵图生成，放置到images和style页面
`npm run sprite`

#### 打包
`npm run build`
    