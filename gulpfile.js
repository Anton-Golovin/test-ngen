'use strict';

var gulp = require('gulp'),
    csso = require('gulp-csso'), 
    prefixCSS = require('gulp-autoprefixer'), 
    uglify = require('gulp-uglifyjs'), 
    clean = require('gulp-clean'),
    mainBowerFiles = require('gulp-main-bower-files'),
    imagemin = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant'),
    filter = require('gulp-filter'),
    mergeStream = require('merge-stream'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps');

var path = {
    dist: { //where
        fonts: './dist/fonts',
        css: './dist/css',
        js: './dist/js',
        img: './dist/img',
        libs: './dist/libs',
        all: './dist',
    },
    src: { //frome
        fonts: './src/fonts/**/*.*',
        css: './src/css/**/*.*',
        js: './src/js/**/*.*',
        img: './src/img/**/*.*',
        libs: './src/libs/**/*.*',
    },
    clear: './dist', //clear
    bowerJson: './bower.json', //bower
} 


/*clear*/
gulp.task('default', function () {  
    return gulp.src(path.clear, {read: false})
        .pipe(clean())
});
/*clear img*/
gulp.task('clear:img', function () {  
    return gulp.src(path.dist.img)
        .pipe(clean())
});
/*clear css*/
gulp.task('clear:css', function () {  
    return gulp.src(path.dist.css)
        .pipe(clean())
});
/*clear js*/
gulp.task('clear:js', function () {  
    return gulp.src(path.dist.js)
        .pipe(clean())
});
/*clear fonts*/
gulp.task('clear:fonts', function () {  
    return gulp.src(path.dist.fonts)
        .pipe(clean())
});
/*clear libs*/
gulp.task('clear:libs', function () {  
    return gulp.src(path.dist.libs)
        .pipe(clean())
});

// all build
gulp.task('dist', [
    'bower',
    'css:dist',
    'js:dist',
    'img:dist',
    'fonts:dist'
]);
/*dist bower*/
gulp.task('bower', ['clear:libs'], function() {
    var filterJS = filter(['**/*.js'], { restore: true });
    var filterCSS = filter(['**/*.css'], { restore: true });
    return gulp.src(path.bowerJson)
        .pipe(mainBowerFiles({
            overrides: {
                bootstrap: {
                    main: [
                        './dist/js/bootstrap.js',
                        './dist/css/bootstrap.css'
                    ]
                }
            }
        }))
        .pipe(filterJS)
        .pipe(concat('libs/libs.min.js'))
        .pipe(uglify()) //compression js
        .pipe(filterJS.restore)
        .pipe(filterCSS)
        .pipe(concat('libs/libs.min.css'))
        .pipe(csso()) //compression css
        .pipe(filterCSS.restore)
        .pipe(gulp.dest(path.dist.all))
});
/*dist css*/
gulp.task('css:dist', ['clear:css'], function () {
    return gulp.src(path.src.css) 
    .pipe(prefixCSS({
            browsers: ['last 5 versions']
        }))
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.init())
    .pipe(csso()) //compression css
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.dist.css))
});
/*dist js*/
gulp.task('js:dist', ['clear:js'], function () {
    return gulp.src(path.src.js)
    .pipe(concat('script.min.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify()) //compression js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.dist.js))
});
/*dist fonts*/
gulp.task('fonts:dist', ['clear:fonts'], function () {  
    var myFonts = gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts));
    
    var bootstrapFonts = gulp.src('bower_components/bootstrap/fonts/*')
    .pipe(gulp.dest(path.dist.fonts));

    return mergeStream(myFonts, bootstrapFonts);
});
/*dist img*/
gulp.task('img:dist', ['clear:img'], function () {
    return gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            use: [imageminPngquant()],
        }))
        .pipe(gulp.dest(path.dist.img))
});

/*gulp watch*/
gulp.task('watch',function () {
    gulp.watch('src/css/*.css', ['css:dist']);
    gulp.watch('src/img/*.*', ['img:dist']);
    gulp.watch('src/js/**', ['js:dist']);
    gulp.watch('src/fonts/*.*', ['fonts:dist']);
});