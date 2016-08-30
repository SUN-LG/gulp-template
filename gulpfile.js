var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var watchPath = require('gulp-watch-path');
var combiner = require('stream-combiner2');
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');
var imagemin = require('gulp-imagemin');
// var sass = require('gulp-sass');
var less = require('gulp-less');


//错误处理函数handlError
var handleError = function(err) {
    var colors = gutil.colors;
    console.log('\n');
    gutil.log(colors.red('Error!'));
    gutil.log('filename: ' + colors.red(err.fileName));
    gutil.log('lineNumber: ' + colors.red(err.lineNumber));
    gutil.log('message: ' + err.message);
    gutil.log('plugin: ' + colors.yellow(err.plugin));
};

//创建压缩js的task
//命令行使用gulp uglify启动此任务。
gulp.task('uglify', function() {
    //利用gulp watch提供的event事件对象和gulp-watch-path模块，实现只编译被修改的js文件
    //event事件对象如下
    /*
    当修改 src/js/log.js 文件时
    event {
        // 发生改变的类型，不管是添加，改变或是删除
        type: 'changed',
        // 触发事件的文件路径
        path: '/Users/nimojs/Documents/code/gulp-book/demo/chapter7/src/js/log.js'
    }
    */
    gulp.watch('src/js/**/*.js', function(event) {
        var paths = watchPath(event, 'src/', 'dist/');
        /*
        编辑src/js/log.js，paths对象如下：
        paths
            { srcPath: 'src/js/log.js',
              srcDir: 'src/js/',
              distPath: 'dist/js/log.js',
              distDir: 'dist/js/',
              srcFilename: 'log.js',
              distFilename: 'log.js' }
        */
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        //不使用combiner2包时，正常流程：
/*        gulp.src(paths.srcPath)
            .pipe(uglify())
            .pipe(gulp.dest(paths.distDir))
*/        // 使用combiner2包，整理错误信息，使之更易读
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            //sourcemaps的初始化
            sourcemaps.init(),
            uglify(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ]);

        combined.on('error', handleError);
    });
});

//运行gulp minifyjs, 单独一次性压缩所以的js文件
gulp.task('minifyjs', function() {
    var combined = combiner2.obj([
        gulp.src('src/js/**/*.js'),
        sourcemaps.init(),
        uglify(),
        sourcemaps.write('./'),
        gulp.dest('dist/js/');
    ]);

    combined.on('error', handleError);
});

//创建压缩css的task
gulp.task('css', function() {
    gulp.watch('src/css/**/*.css', function(event) {
        var paths = watchPath(event, 'src/', 'dist/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
                browser: 'last 2 versions'
            }))
            .pipe(minifyCSS())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    });

});

//运行gulp minifycss, 单独一次性压缩所以的css文件
gulp.task('minifycss', function () {
    gulp.src('src/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
          browsers: 'last 2 versions'
        }))
        .pipe(minifycss())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css/'))
});

//创建压缩img的task
gulp.task('images', function() {
    gulp.watch('src/images/**/*', function(event) {
        var paths = watchPath(event, 'src/', 'dist/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(paths.distDir))
    });
});

//运行gulp minifyimg, 单独一次性压缩所以的img文件
gulp.task('minifyimg', function () {
    gulp.src('src/images/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'))
});

//创建编译less的task
gulp.task('less', function() {
    gulp.watch('src/less/**/*.less', function(event) {
        var paths = watchPath(event, 'src/less', 'dist/css');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        var combined = bombiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            autoprefixer({
                browser: 'last 2 versions'
            }),
            less(),
            minifyCSS(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ]);
    });

    combined.on('error', handleError);
});

//运行gulp minifyless, 单独一次性压缩所以的less文件
gulp.task('minifyless', function() {
    var combined = combiner.obj([
        gulp.src('src/less/**/*.less'),
        sourcemaps.init(),
        autoprefixer({
            browser: 'last 2 versions'
        }),
        less(),
        minifyCSS(),
        sourcemaps.write('./'),
        gulp.dest('dist/css/')
    ]);

    combined.on('error', handleError);
});

//文件复制，用于将fonts等目录中的文件复制到其他文件夹
gulp.task('copy', function() {
    gulp.watch('src/fonts/**/*', function(event) {
        var paths = watchPath(event, 'src/', 'dist/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(gulp.dest(paths.distDir));
    });

});

gulp.task('copystatic', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
});

//gulp 的默认task，直接执行gulp就可以执行的任务
gulp.task('default', ['uglify', 'css', 'less', 'images']);