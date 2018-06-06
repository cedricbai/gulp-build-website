'use strict';
var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  minifycss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  maps = require('gulp-sourcemaps'),
  imagemin = require('gulp-imagemin'),
  runsequence = require('run-sequence'),//make sure all tasks run in sequence
  webserver = require('gulp-webserver'),
  del = require('del');

/*
	concatenate all javascripts files
*/
gulp.task("concatScripts", function(){
	return gulp.src([
		'js/global.js',
		'js/circle/autogrow.js',
		'js/circle/circle.js'])
	.pipe(concat("app.js"))
	.pipe(gulp.dest("dist/scripts"));
});

/*
	minify the concatenated javascript file
*/
gulp.task("minifyScripts", ["concatScripts"], function() {
	return gulp.src("dist/scripts/app.js")
		.pipe(maps.init())
		.pipe(uglify())
		.pipe(rename('all.min.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest("dist/scripts"));
});

gulp.task("scripts", ['concatScripts', 'minifyScripts']);

/*
	compile the sass file into css
*/
gulp.task('compileSass', function() {
 	return gulp.src("sass/global.scss")
 		.pipe(sass())
 		.pipe(gulp.dest("dist/styles"));
});
/*
	minify the css file
*/
gulp.task('minifyStyle', ["compileSass"], function() {
	return gulp.src("dist/styles/global.css")
		.pipe(maps.init())
		.pipe(minifycss())
		.pipe(rename('all.min.css'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest("dist/styles"));
});

/*
	optimize all the image files
*/
gulp.task('images', function() {
	return gulp.src("images/*")
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'));
});
gulp.task('clean', function() {
	return del(['dist']);
});

gulp.task('build', ["clean"], function() {
	gulp.start('copyothers');
	gulp.start('scripts');
	gulp.start('styles');
	gulp.start('images');
});

/*
 start the webserver
*/
gulp.task('serve', function() {
	return gulp.src('dist')
		.pipe(webserver({
			livereload: true,
			directoryListing: false,
			open: true
		}));
});
gulp.task('copyothers', function () {
    return gulp.src(['index.html',
                    'icons/**'], 
                    { base: './' }) //keep folder structure
    .pipe(gulp.dest('dist'));
});

/*
	make sure the gulp tasks are run in sequence so that server will run after the 
	entire dist file has been built
*/
gulp.task("default", function() {
	runsequence(
		'clean',
		['copyothers', 'scripts', 'styles', 'images'],
		'serve'
	);
});
gulp.task('styles', ['compileSass', 'minifyStyle']);