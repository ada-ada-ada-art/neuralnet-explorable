var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var minifyjs = require('gulp-minify');
var imagemin = require('gulp-imagemin');
var notify = require('gulp-notify');

gulp.task('minify-css', function() {
    gulp.src('src/scss/**/*.scss')
        .pipe(sass()
            .on('error', notify.onError('Error: <%= error.message %>'))
        )
        .pipe(prefix('last 2 versions'))
        .pipe(minify())
        .pipe(gulp.dest('dist/css/'))
});


gulp.task('compress-js', function() {
	gulp.src('src/js/*.js')
		.pipe(minifyjs({
			exclude: ['tasks'],
			ignoreFiles: ['.combo.js', '-min.js']
		}).on('error', notify.onError('Error: <%= error.message %>')))
		.pipe(gulp.dest('dist/js/'))
});

gulp.task('move-lib-js', function() {
	gulp.src('src/lib/**/*.min.js')
		.pipe(gulp.dest('dist/js/'));
});

gulp.task('move-img', function() {
    return gulp.src('src/img/**/*.{jpg,jpeg,png,svg,gif,ico}')
    .pipe(gulp.dest('dist/img/'));
});

//Watch task
gulp.task('default',function() {
    gulp.start('minify-css');
    gulp.start('compress-js');
    gulp.start('move-img');
    gulp.start('move-lib-js');
    gulp.watch('src/lib/**/*.js', ['move-lib-js']);
    gulp.watch('src/scss/**/*.scss',['minify-css']);
    gulp.watch('src/js/**/*.js', ['compress-js']);
    gulp.watch('src/img/**/*.{jpg,jpeg,png,svg,gif,ico}', ['move-img']);
});