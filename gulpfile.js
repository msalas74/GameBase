var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var webserver = require('gulp-webserver');
var imagemin = require('gulp-imagemin');
var imageminJpegtran = require('imagemin-jpegtran');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');

// environment
var environment = 'development';

var jsFiles = [
  'node_modules/phaser/build/phaser.min.js',
  'app/js/boot.js',
  'app/js/preloader.js',
  'app/js/mainMenu.js',
  'app/js/enemy.js',
  'app/js/game.js',
  'app/js/app.js'
];

gulp.task('js', function () {
  return gulp.src(jsFiles)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('data', function () {
  return gulp.src('app/js/*.json')
    .pipe(gulp.dest('build/js'));
});

// JS linting task
gulp.task('jshint', function () {
  return gulp.src('app/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


// Styles build task and concat all the files
gulp.task('styles', function () {
  return gulp.src(['app/css/*.css'])
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('build/css'));
});

// Watch task
gulp.task('watch', function () {
  gulp.watch('app/js/*.js', ['jshint', 'js']);
  gulp.watch('app/*.html', ['html']);
  gulp.watch('app/css/styles.css', ['styles']);
});

// Minify task
gulp.task('html', function () {
  if (environment === 'production') {
    return gulp.src('app/index.html')
      .pipe(minifyHTML())
      .pipe(gulp.dest('build/'));
  } else {
    return gulp.src('app/index.html')
      .pipe(gulp.dest('build/'));
  }
});

gulp.task('views', function () {
  if (environment === 'production') {
    return gulp.src('app/views/*.html')
      .pipe(minifyHTML())
      .pipe(gulp.dest('build/views/'));
  } else {
    return gulp.src('app/views/*.html')
      .pipe(gulp.dest('build/views/'));
  }
});

// image optimize task =====================
gulp.task('images', function () {
  return gulp.src(['app/img/*', 'app/img/**/*'])
    // .pipe(imagemin({
    //  progressive: true,
    //  use:[imageminJpegtran({ptogressive: true})]
    // }))
    .pipe(gulp.dest('build/img'));
});

// fonts
gulp.task('fonts', function () {
  gulp.src('app/fonts/*')
    .pipe(gulp.dest('build/fonts'));
});

// Webserver
gulp.task('webserver', function () {
  gulp.src('build/')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});
// Build task
if (environment !== 'production') {
  gulp.task('build', ['jshint', 'html', 'js', 'styles', 'fonts', 'images']);
} else {
  gulp.task('build', ['jshint', 'html', 'js', 'fonts', 'images']);
}
// Default task
gulp.task('default', ['jshint', 'styles', 'watch', 'webserver']);
