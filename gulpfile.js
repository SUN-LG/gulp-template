var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');

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

//gulp watch监听文件修改，自动执行任务
gulp.task('auto', function() {
    gulp.watch('js/*.js', ['script']);
    gulp.watch('css/*.css', ['css']);
});

//gulp 的默认task，直接执行gulp就可以执行的任务
gulp.task('default', ['script', 'css', 'auto']);