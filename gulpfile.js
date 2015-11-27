var gulp = require('gulp'),  // node.js command to bring in gulp library to create different tasks with gulp
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
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

gulp.task('coffee', function() {
	gulp.src(coffeeSources)  //first specify the original location of what I want to process.  Could be an array of files or an individual one     
	.pipe(coffee({bare:true}) //coffee variable above and use one of the coffeescript options in the language     
		.on('error', gutil.log)) //so that crashes won't stop execution of other gulp tasks     
	.pipe(gulp.dest('components/scripts')) //where to send the file to once the processing is done
});

gulp.task('js', function() {
	gulp.src(jsSources)
	.pipe(gconcat('script.js'))  // index.html:   <script src="js/script.js"></script>
	.pipe(gulp.dest('builds/development/js'))

});
