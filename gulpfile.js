const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');

let jsDirs = ['./js/src/constants.js',
              './js/src/Player.js',
              './js/src/NotMarioKart.js']

//let jsDirs = ['./js/src/**/*.js'];

gulp.task('build', function() {
    return gulp
        .src(jsDirs)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ['env']
            })
        )
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./js/dist/'));
});

gulp.task('build:watch', ['build'], function() {
    gulp.watch(jsDirs, ['build']);
});
