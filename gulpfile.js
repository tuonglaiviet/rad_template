var gulp = require('gulp');
var bulkSass = require('gulp-sass-bulk-import');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');
var uglify = require("gulp-uglify");
var rename = require('gulp-rename');
//New connect
var browserSync = require("browser-sync");
var gulpRanInThisFolder = process.cwd();
var res = gulpRanInThisFolder.split("/");
var ProjectName = res[res.length - 1];
url  = ""+ProjectName+".out.src.com";
var sourcemaps = require('gulp-sourcemaps');
// :nested
// :compact
// :expanded
// :compressed

gulp.task('sass', function () {
    return gulp.src('src/scss/style.scss')
        .pipe(bulkSass())
        //.pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            errLogToConsole: false,
            includePaths: [ 'src/', 'mod/' ],
        }))
        .on('error', function(err) {
            notify().write(err);
            this.emit('end');
        })
        //.pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest('dist/assets/css'))
        //.pipe(notify('Successfully css combine'))
        .pipe(browserSync.reload({
            stream: true
    }));
});

// js Task Settings
gulp.task('js', function() {
    return gulp.src('src/js/**/*.js')
    .pipe(plumber())
    //.pipe(concat()) //file join
    //.pipe(rename('app.js'))  // file rename
    .pipe(uglify({ //minfy
        //preserveComments: 'some' // comment options
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/assets/js')) // file dir
    //.pipe(notify('js task finished')); // message
});

gulp.task('reload', function (){
    browserSync.reload();
});

gulp.task('browser-sync', function() {
    var files = [
            '**/*.php',
            '**/*.{png,jpg,gif}'
            ];
    browserSync.init(files, {
        // Read here http://www.browsersync.io/docs/options/
        proxy: url,
        port: 10001,
        notify: false,
        // Inject CSS changes
        injectChanges: true,
        // Open the site in Chrome

    });
});

gulp.task('watch', function () {
    gulp.watch("src/scss/**/*.scss",["sass"]); //run compass
    gulp.watch("src/js/**/*.js",["js"]); //run compass
     //gulp.watch(['*.php'], ["reload"]);
    gulp.watch(['**/*.php'], ["reload"]);
});
gulp.task('default', [ 'watch','browser-sync']);
