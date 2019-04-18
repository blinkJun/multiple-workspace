const fs = require("fs");

const gulp = require("gulp");
const spritesmith = require('gulp.spritesmith');

const sptieDir = './src/sprites/'
const outPut = {
    image:'./src/images',
    scss:'./src/style'
}

// 合并图片
gulp.task('sprite', function (done) {
    let files = fs.readdirSync(sptieDir)
    files.forEach((spriteName) => {
        let fileStat = fs.statSync(sptieDir + spriteName)
        if (fileStat.isDirectory()) {
            var spriteData = gulp.src(sptieDir + spriteName + '/*.png').pipe(spritesmith({
                imgName: spriteName + '.png',
                cssName: '\_' + spriteName + '.scss',
                cssTemplate: 'scss.template.mustache',
                cssOpts: {
                    url: 'spriteUrl',
                    picUrl: '@/images/'
                },
                algorithm: "binary-tree",
                cssFormat: 'scss',
                padding: 15
            }))
            spriteData.img.pipe(gulp.dest(outPut.image));
            spriteData.css.pipe(gulp.dest(outPut.scss));
        }
    })
    done()
});
