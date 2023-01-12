const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const composer = require('gulp-uglify/composer');
const pump = require('pump');
const uglifyjs = require('uglify-js');
const tsProject = ts.createProject('tsconfig.json');
const minify = composer(uglifyjs, console);

gulp.task('compile', function () {
  const tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject());

  return tsResult.js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./tmp/release'));
});

gulp.task('uglify', function () {
  return pump(
    [
      gulp.src('./tmp/release/**/*.js'),
      minify({}),
      gulp.dest('./dist')
    ]
  );
});

gulp.task('clean', function () {
  return gulp.src('./tmp', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('default', gulp.series('compile', 'uglify', 'clean'));
