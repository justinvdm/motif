var gulp = require('gulp')
var peg = require('gulp-peg')
var mocha = require('gulp-mocha')
var umd = require('gulp-wrap-umd')
var merge = require('merge-stream')
var concat = require('gulp-concat')


function compile() {
  return gulp.src('src/parser.pegjs')
    .pipe(peg({exportVar: ' var parser'}))
}


gulp.task('build', function() {
  return merge(compile(), gulp.src('src/motif.js'))
    .pipe(concat('motif.js'))
    .pipe(umd({
      exports: 'motif',
      namespace: 'motif'
    }))
    .pipe(gulp.dest('.'))
})


gulp.task('test', ['build'], function() {
  return gulp.src('tests/motif.test.js')
    .pipe(mocha())
})


gulp.task('default', ['test'])
