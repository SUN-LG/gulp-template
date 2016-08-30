var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
// var sass = require('gulp-sass');
var less = require('gulp-less');

//创建压缩js的task
//命令行使用gulp script启动此任务。
gulp.task('script', function() {
    gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

//创建压缩css的task
gulp.task('css', function() {
    gulp.src('css/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/css'));
});

//创建压缩img的task
gulp.task('images', function() {
    gulp.src('images/*.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'));
});

//创建编译sass的task
// gulp.task('sass', function() {
//     return gulp.src('sass/**/*.scss')
//                 .pipe(sass().on('error', sass.logError))
//                 .pipe(gulp.dest('dist/css'));
// });

//创建编译less的task
gulp.task('less', function() {
    gulp.src('less/**.less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});

//gulp watch监听文件修改，自动执行任务
gulp.task('auto', function() {
    gulp.watch('js/*.js', ['script']);
    gulp.watch('css/*.css', ['css']);
    gulp.watch('images/*.*', ['images']);
    // gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('less/**.less', ['less']);
});

//gulp 的默认task，直接执行gulp就可以执行的任务
gulp.task('default', ['script', 'css', 'images', 'less', 'auto']);