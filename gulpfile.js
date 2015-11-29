var gulp = require('gulp'),  // node.js command to bring in gulp library to create different tasks with gulp
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    browserify = require('gulp-browserify'),
    notify = require('gulp-notify'),
    debug = require('gulp-debug'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    concat = require('gulp-concat');

var env, sassStyle, coffeeSources, jsSources, htmlSources, jsonSources, sassSources, outputDir

// Check an environment variable and assign it to env.  Otherwise, default to value of development 
var env = process.env.NODE_ENV || 'default';

if (env==='development') {
	outputDir = 'builds/development/';
	gutil.log("development environment found");
	sassStyle = 'expanded';
} else if (env==='production') {
	outputDir = 'builds/production/';
	gutil.log("production environment found");
	sassStyle = 'compressed';
} else if (env==='default') {
	outputDir = 'builds/development/';
	gutil.log("environment variable not found.  default");
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/development/';
	gutil.log("unknown environment value");
	sassStyle = 'expanded';
}

/*
gulp.task('log', function() {
	gutil.log('workflows are awesome!');


}); //create a taks called log
*/

coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
]; //this order is the order in which the files will get processed
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

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
	.pipe(gulpif(env === 'production', uglify()))
	.pipe(gulp.dest(outputDir + 'js'))
	.pipe(connect.reload())
	.pipe(notify({message: 'Just completed creating js files'}))
});


sassSources = ['components/sass/style.scss'];  //don't need to include all sass files because sass has its own import commands

gulp.task('compass', function() {
	gulp.src(sassSources)
	.pipe(debug({title: 'compass task:'}))
	//.pipe(notify({message: 'About to create css files'}))
	.pipe(compass({
		css: outputDir + 'css', //automatically places the output css file here.  No need for dest pipe value
		sass: 'components/sass',   //where the sass files are located
		image: outputDir + 'images',
		style: sassStyle //sass output style that we're using [nested|expanded|compact|compressed]
		})
		.on('error', gutil.log) //so that crashes won't stop execution of other gulp tasks     
	)
	.pipe(gulp.dest(outputDir + 'css'))
	.pipe(connect.reload()) // this doesn't work for whatever reason so I had to create a separate task to watch the resulting css file and reload on that
	//.pipe(notify({message: 'Just completed creating css files'}))
});

/*
gulp.task('cssReload', function (){
	gulp.src("builds/development/css/*")
	.pipe(connect.reload())
});
*/

gulp.task('all',['coffee', 'js', 'compass']);
gulp.task('default',['coffee', 'js', 'compass', 'images', 'json','html','connect','watch']);


gulp.task('watch', function(){
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch('builds/development/js/*.json', ['json']);
	gulp.watch('builds/development/images/**/*.*', ['images']);
});

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	})
});

gulp.task ('html', function() {
	gulp.src('builds/development/*.html')
	.pipe(gulpif(env === 'production', minifyHTML()))
	.pipe(gulpif(env === 'production', gulp.dest(outputDir)))
	.pipe(connect.reload())
});

gulp.task ('json', function() {
	gulp.src('builds/development/js/*.json')
	.pipe(gulpif(env === 'production', jsonminify()))
	.pipe(gulpif(env === 'production', gulp.dest(outputDir + 'js')))
	.pipe(connect.reload())
});

gulp.task ('images', function(){
	// ** means any subfolders
	gulp.src('builds/development/images/**/*.*')
	.pipe(gulpif(env === 'production', imagemin({
		progressive: true,
		svgoPlugins: [{ removeViewBox: false}],
		use: [pngcrush()]

	})))
	.pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images'))) 
	.pipe(connect.reload())
});