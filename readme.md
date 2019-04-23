## 一个多html文件前端开发环境目录

    1. 多个html入口，非单页面应用程序；
    2. 热替换，或者修改代码后自动刷新浏览器；
    3. css预处理，前缀添加，压缩，url添加版本信息，独立css文件；
    4. js预处理（ts=>es6=>es5），压缩；
    5. 使用gulp单独生成精灵图片和图标样式scss

### 使用方式

#### 修改为自己的git目录

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
 


#### 启动开发环境
`npm run serve`

#### 启动开发环境并自动打开浏览器
`npm run start`

#### 将sprite文件夹下各个文件夹内的图标作为一张精灵图生成，放置到images和style页面
`npm run sprite`

#### 打包
`npm run build`
    