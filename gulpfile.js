var gulp = require('gulp'),     // connecting gulp
    sass = require('gulp-sass'), // connecting SASS
    sassGlob = require('gulp-sass-glob'), // file import via input mask
    browserSync = require('browser-sync'),  // connecting Browser Sync
    concat = require('gulp-concat'),        // connecting pack to concatenate files
    cssnano = require('gulp-cssnano'),       // connecting pack for minifying CSS files
    rename = require('gulp-rename'),        // connecting lib to rename files   
    uglify = require('gulp-uglify'),        // conneting lib to minify JS files
    del = require('del');                   // connecting lib for deleting files and folders 
    cache = require('gulp-cache'),          // connecting caching library 
    autoprefixer = require('gulp-autoprefixer'),    // lib to automate prefixes
    flatten = require('gulp-flatten'),      // lib to clean paths of converted files 
    sourcemaps = require('gulp-sourcemaps'), // connecing Soucemaps
    //deploy = require('gulp-gh-pages');
    

    // compiling SASS to CSS 
    gulp.task('sass', function() {
        return gulp.src('app/sass/main.scss')

        .pipe(sourcemaps.init()) // initializing soucemaps
        .pipe(sassGlob())        // import files
        .pipe(sass({

        }))

        // creating prefixes in CSS
        .pipe(autoprefixer(['last 15 versions'], { 
            cascade: true,
        }))

        // cleaning paths to files
        .pipe(flatten()) 

        // sending to styles from csss 
        .pipe(sourcemaps.write('../maps'))

        // upload processed CSS files 
        .pipe(gulp.dest('app/css/'))

        // will reload browsers if detects changes in files, or inject files where possible 
        .pipe(browserSync.reload({
            stream: true,
        }))
    })


    // setting auto reload of browser
    gulp.task('browser-sync', function() {
        browserSync({                           // launch browser sync 
            server: {                           // define server params
                baseDir: 'app',                 // setting baseDir for a server
            },
            notify: false,                      // disabling notifications 
        });
    });


    
    gulp.task('scripts', function(){
        return (gulp.src([          //take all libs 
            'app/libs/**/*.js'
        ]))

        .pipe(concat('libs.min.js'))    //build libs to a new file libs.min.js
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))      // upload to the file to js folder
    })



    // concatenation and compression CSS files 
    gulp.task('css-libs', function() {
        return gulp.src('app/libs/*.css') //chose files for minification
            

        .pipe(concat('libs.min.css'))   // build libs in a new file
        .pipe(cssnano())                // launch a minification
        .pipe(gulp.dest('app/css'))          // upload minified file to a folder

    })

    // tracking changes in the files
    gulp.task('watch', ['browser-sync', 'css-libs', 'scripts', 'sass'], function() {
        // task will run in 500ms and the file will be saved 
        gulp.watch('app/**/*.scss', function(event, cb) { 
            setTimeout(function() {
                gulp.start('sass');
            }, 500) 
        })

        gulp.watch('app/*.html', browserSync.reload);  // will reload browser in case if change in html is detected
        gulp.watch('app/js/**/*.js', browserSync.reload); // weload browser if changes in js files is dedected 
    })

    // clean dist folder before build 
    gulp.task('clean', function() {
        return del.sync('dist');
    })


    // upload to production 
    gulp.task('build', ['clean', 'sass', 'css-libs', 'scripts'], function() {
      // transfer css libs and main style file into production 
      var buildCss = gulp.src([           
        'app/css/main.css',
        'app/css/libs.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    // transfer fonts to production
    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

    // transfer all images to production folder
    var buildImg = gulp.src('app/img/**/*')
    .pipe(gulp.dest('dist/img'))

    // transfer all js files to production folder 
    var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'))

    var buildHTML = gulp.src('app/index.html')
    .pipe(gulp.dest('dist'))

    })

    // cleaning cache
    gulp.task('clear', function() {
        return cache.clearAll();
    })

    gulp.task('default', ['watch']);

    // to deploy a project to gh-pages
    // gulp.task('deploy', function(){
    //     return (gulp.src("./dist/**/*"))
    //     .pipe(deploy())
    // });