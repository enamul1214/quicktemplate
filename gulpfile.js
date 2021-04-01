const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const browsersync = require('browser-sync').create();

// Sass Task
const scssTask = () => {
    return src('src/sass/style.scss', { sourcemaps: true })
        .pipe(sass()) 
        .pipe(postcss([cssnano]))
        .pipe(dest('assets/css', { sourcemaps: '.' }))
}

// Javascript Task
const jsTask = () => {
    return src(['src/vendors/js/**/*.js','src/js/custom-script.js'])
        .pipe(plumber())
        .pipe(concat('bundle.js'))
        .pipe(dest('assets/js'))
}

// Font Awesome Icons Task
const iconsTask = () => {
    return src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(dest('assets/webfonts/'));
}

// Vendor CSS Task
const vendorCssTask = () => {
    return src('src/vendors/css/**/*.css')
        .pipe(plumber())
        .pipe(concat('bundle.css'))
        .pipe(dest('assets/css'))
}

// Minifies CSS files task
const minifyCssTask = () => {
    return src('assets/css/**/*.css')
      .pipe(plumber())
      .pipe(postcss([cssnano]))
      .pipe(concat('style.min.css'))
      .pipe(dest('assets/css'));
  }
  

// Minifies js files
const minifyJsTask = () => {
      return src('assets/js/**/*.js')
          .pipe(plumber())
          .pipe(minify())
        //   .pipe(rename({suffix: '.min'}))
          .pipe(dest('assets/js'));
  }

// Browser sync Tasks
const browsersyncServe = (cb) => {
    browsersync.init({
        server: {
            baseDir: '.'
        }
    });
    cb();
}

// Browser Reload Task
const browsersyncReload = (cb) => {
    browsersync.reload();
    cb();
}

// Watch Task
const watchTask = () => {
    watch(['*.html', '*.php'], browsersyncReload);
    watch(['src/vendors/css/**/*.css','src/sass/**/*.scss','src/js/**/*.js'], series(vendorCssTask, iconsTask, scssTask, jsTask, browsersyncReload));
}

// Default Gulp Task
exports.default = series (
    scssTask,
    vendorCssTask,
    iconsTask,
    jsTask,
    browsersyncServe,
    watchTask
);

// Build Gulp Task
exports.build = series (
    scssTask,
    vendorCssTask,
    jsTask,
    minifyCssTask,
    minifyJsTask
);