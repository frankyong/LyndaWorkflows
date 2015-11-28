var gulp = require('gulp'),  // node.js command to bring in gulp library to create different tasks with gulp
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    browserify = require('gulp-browserify'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat');


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
	.pipe(concat('script.js'))  // index.html:   <script src="js/script.js"></script>
	.pipe(browserify())
	.pipe(gulp.dest('builds/development/js'))
	.pipe(connect.reload())
	.pipe(notify({message: 'Just completed creeating js files'}))
});

var sassSources = ['components/sass/style.scss'];  //don't need to include all sass files because sass has its own import commands

gulp.task('compass', function() {
	gulp.src(sassSources)
	//.pipe(notify({message: 'About to create css files'}))
	.pipe(compass({
		//css: 'builds/development/css', //automatically places the output css file here.  No need for dest pipe value
		sass: 'components/sass',   //where the sass files are located
		image: 'builds/development/images',
		style: 'expanded' //sass output style that we're using [nested|expanded|compact|compressed]
		})
		.on('error', gutil.log) //so that crashes won't stop execution of other gulp tasks     
	)
	.pipe(gulp.dest('builds/development/css'))
	.pipe(connect.reload()) // this doesn't work for whatever reason so I had to create a separate task to watch the resulting css file and reload on that
	//.pipe(notify({message: 'Just completed creeating css files'}))
});

/*
gulp.task('cssReload', function (){
	gulp.src("builds/development/css/*")
	.pipe(connect.reload())
});
*/

gulp.task('all',['coffee', 'js', 'compass']);
gulp.task('default',['coffee', 'js', 'compass', 'connect','watch']);


gulp.task('watch', function(){
	gulp.watch(coffeeSources, ['coffee'])
	gulp.watch(jsSources, ['js'])
	gulp.watch('components/sass/*.scss', ['compass'])
	// gulp.watch('builds/development/css/*', ['cssReload'])
});

gulp.task('connect', function() {
	connect.server({
		root: 'builds/development/',
		livereload: true
	})
});

