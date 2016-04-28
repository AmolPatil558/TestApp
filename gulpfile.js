// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
// var less = require('gulp-less');
var livereload = require('gulp-livereload');
// tasks
gulp.task('lint', function() {
    gulp.src(['./app/**/*.js', '!./bower_components/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});
gulp.task('clean', function() {
    gulp.src('./dist/*')
        .pipe(clean({ force: true }));
});
gulp.task('minify-css', function() {
    var opts = { comments: true, spare: true };
    gulp.src(['./app/**/*.css', '!./bower_components/**'])
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('./dist/'))
});
gulp.task('minify-js', function() {
    gulp.src(['./app/**/*.js', '!./bower_components/**'])
        .pipe(uglify({
            // inSourceMap:
            // outSourceMap: "app.js.map"
        }))
        .pipe(gulp.dest('./dist/'))
});
gulp.task('copy-bower-components', function() {
    gulp.src('./bower_components/**')
       .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
        .pipe(gulp.dest('dist/bower_components'));
    console.log("Copy bower components completed successfully");
});
gulp.task('copy-html-files', function() {
    gulp.src('./app/**/*.html')
        .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
        .pipe(gulp.dest('dist/'));
    console.log("Copy HTML completed successfully");
});

// gulp.task('less', function() {
//   gulp.src('less/*.less')
//     .pipe(less())
//     .pipe(gulp.dest('css'))
//     .pipe(livereload());
// });
 
gulp.task('watch', function() {
    $.livereload.listen();

    gulp.watch([
        path.join(config.path.app, './app/**/*.html'),
        path.join( './app/**/*.js')
    ]).on('change', stackReload);

    // a timeout variable
    var timer = null;

    // actual reload function
    function stackReload() {
        var reload_args = arguments;

        // Stop timeout function to run livereload if this function is ran within the last 250ms
        if (timer) clearTimeout(timer);

        // Check if any gulp task is still running
        if (!gulp.isRunning) {
            timer = setTimeout(function() {
                $.livereload.changed.apply(null, reload_args);
            }, 250);
        }
    }

});

gulp.task('connect', function() {
    connect.server({
        root: 'app/',
        port: 8888
    });
});
gulp.task('connectDist', function() {
    connect.server({
        root: 'dist/',
        port: 9999
    });
});


// default task
gulp.task('default',
    ['lint', 'connect']
);

gulp.task('build', ['clean'], function(callback) {
    gulp.start(['lint', 'minify-css', 'minify-js', 'copy-html-files', 'copy-bower-components', 'connectDist'], callback);
});

// gulp.task('build', function() {
//     runSequence(
//         ['clean', 'lint', 'minify-css', 'minify-js', 'copy-html-files', 'copy-bower-components', 'connectDist']
//     );
// });
//