const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();

const jsDirs = [
    './js/src/constants.js',
    './js/src/Player.js',
    './js/src/NotMarioKart.js'
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
        .pipe(gulp.dest('./js/dist/'));
});

gulp.task('build:reload', ['build'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('build:watch', ['build'], function () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch(jsDirs, ['build:reload']);
});
