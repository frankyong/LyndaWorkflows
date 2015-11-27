var gulp = require('gulp'),  // node.js command to bring in gulp library to create different tasks with gulp
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    compass = require('gulp-compass'),
    browserify = require('gulp-browserify'),
    gconcat = require('gulp-concat');


/*
gulp.task('log', function() {
	gutil.log('workflows are awesome!');


}); //create a taks called log
*/

var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
]; //this order is the order in which the files will get processed

var sassSources = ['components/sass/style.sass'];  //don't need to include all sass files because sass has its own import commands

gulp.task('coffee', function() {
	gulp.src(coffeeSources)  //first specify the original location of what I want to process.  Could be an array of files or an individual one     
	.pipe(coffee({bare:true}) //coffee variable above and use one of the coffeescript options in the language     
		.on('error', gutil.log)) //so that crashes won't stop execution of other gulp tasks     
	.pipe(gulp.dest('components/scripts')) //where to send the file to once the processing is done
});

gulp.task('js', function() {
	gulp.src(jsSources)
	.pipe(gconcat('script.js'))  // index.html:   <script src="js/script.js"></script>
	.pipe(browserify())
	.pipe(gulp.dest('builds/development/js'))

});

gulp.task('compass', function() {
	gulp.src(sassSources)
	.pipe(compass({
		css: 'builds/development/css', //automatically places the output css file here.  No need for dest pipe value
		sass: 'components/sass',   //where the sass files are located
		image: 'builds/development/images',
		style: 'expanded' //sass output style that we're using [nested|expanded|compact|compressed]
	})
	.on('error', gutil.log))
});

gulp.task('all',['coffee', 'js', 'compass']);
gulp.task('default',['coffee', 'js', 'compass']);


gulp.task('watch', function(){
	gulp.watch(coffeeSources, ['coffee'])
	gulp.watch(jsSources, ['js'])
	gulp.watch('components/sass/*.scss', ['compass'])
});