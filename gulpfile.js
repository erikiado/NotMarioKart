const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');

const jsDirs = [
    './public/js/src/constants.js',
    './public/js/src/Physics.js',
    './public/js/src/Checkpoint.js',
    './public/js/src/Box.js',
    './public/js/src/Player.js',
    './public/js/src/NotMarioKart.js',
];

gulp.task('build', function () {
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
        .pipe(gulp.dest('./public/js/dist/'));
});

gulp.task('build:watch', ['build'], function () {
    gulp.watch(jsDirs, ['build']);
});
