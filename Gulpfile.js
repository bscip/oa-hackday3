var gulp = require('gulp'),

    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    //jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr(),

    browserify = require('browserify'),
    source = require('vinyl-source-stream'),

    PORT_EXPRESS = 4000,
    PORT_LIVERELOAD = 35729,
    EXPRESS_ROOT = __dirname
    ;

gulp.task('ds', function() {
  var DoStuffApi = require('./util/dostuff'),
      secret = require('./util/secret'),
      DS = new DoStuffApi(secret.api_key_dostuff_sf);

  DS.test();
  DS.eventsCount(function(err, count) {
    if (!err) {
      console.log('There are '+counts.events+' events, over '+counts.pages+' pages of results');
    }
  });
  DS.venuesCount(function(err, counts) {
    if (!err) {
      console.log('There are '+counts.venues+' venues, over '+counts.pages+' pages of results');
    }
  });
});

gulp.task('browserify', function() {
  return browserify('./app/scripts/main.js')
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('bundle.js'))
    // Start piping stream to tasks!
    .pipe(livereload(server))
    .pipe(gulp.dest('./app/scripts/build/'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Styles
gulp.task('styles', function() {
  return gulp.src('app/css/main.scss')
    .pipe(sass({ style: 'expanded', includePaths: require('node-bourbon').includePaths, }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('app/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(livereload(server))
    .pipe(gulp.dest('app/css/min'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('app/scripts/**/*.js')
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('app/scripts/min'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('app/scripts/min'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(livereload(server))
    .pipe(gulp.dest('app/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Templates
gulp.task('templates', function() {
  return gulp.src('app/views/**/*.hbs')
    .pipe(livereload(server))
    .pipe(notify({ message: 'Templates task complete' }));
});

/*
// for later, if serving up the mins from new dirs
// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false})
    .pipe(clean());
});
*/

gulp.task('startExpress', function() {
  var express = require('express');
      routes = require('./routes'),
      http = require('http'),
      path = require('path'),
      cons = require('consolidate'),
      app = express();

  // use handlebars
  app.set('views', path.join(EXPRESS_ROOT, 'app/views'));
  app.engine('hbs', cons.handlebars);
  app.set('view engine', 'hbs');

/*
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(app.router);
*/

  app.use(require('connect-livereload')());
  app.use(express.static(path.join(EXPRESS_ROOT, 'app')));
  app.listen(PORT_EXPRESS);

  app.get('/', routes.index);
});

gulp.task('startLivereload', function() {
  server.listen(PORT_LIVERELOAD);
});

gulp.task('updateLivereload', function(event) {
  gulp.src(event.path, {read: false})
      .pipe(require('gulp-livereload')(lr));
});
 
// Default task
//gulp.task('default', ['clean'], function() {
gulp.task('default', ['startExpress','startLivereload','browserify','styles','images','templates'], function() {
  // Watch .scss files
  gulp.watch('app/css/**/*.scss', ['styles']);
  // Watch .js files
  gulp.watch('app/scripts/**/*.js', ['browserify']);
  // Watch image files
  gulp.watch('app/images/**/*', ['images']);
  // Watch templates
  gulp.watch('app/views/**/*.hbs', ['templates']);
});


