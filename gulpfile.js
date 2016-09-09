var gulp = require('gulp'),
	gutil = require('gulp-util'),
	browserify = require('gulp-browserify'),
	sass = require('gulp-sass'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	mustache = require("gulp-mustache");

var env,
	jsSources,
	sassSources,
	htmlSources,
	sassStyle,
	outputDir,
	templatesSources;

env = process.env.NODE_ENV || 'development';

if (env === 'development') {
	outputDir = 'builds/development';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production';
	sassStyle = 'compressed';
}

jsSources = [
	'components/scripts/index.js'
];

sassSources = [
	'components/sass/style.scss',
	'components/sass/_base.scss',
	'components/sass/_variables.scss'
];

templatesSources = [
	'components/templates/*.html'
];

gulp.task('html', function() {
	gulp.src(templatesSources)
	.pipe(mustache({
		company: "Vitil Solutions",
		title: "Admin Console",
		signAccount: "Sign in to your account",
		email: "Email address",
		password: "Password",
		staySign: "Stay signed in",
		signIn: "Sign in",
		forgotPass: "Forgot password?"

	}))
	.pipe(gulp.dest(outputDir))
	.pipe(connect.reload());
});

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('scripts.js'))
		.pipe(browserify())
		.pipe(gulpif(env === 'production', uglify()))
		.pipe(gulp.dest(outputDir + '/js'))
		.pipe(connect.reload())
});

gulp.task('sass', function () {
	var processors = [
		autoprefixer({browsers: ['last 2 version']})
	];
	return gulp.src(sassSources)
	.pipe(sass().on('error', sass.logError))
		.pipe(postcss(processors))
		.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(outputDir + '/css'))
		.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch(jsSources, ['js']);
	gulp.watch(sassSources, ['sass']);
	gulp.watch(templatesSources, ['html']);
});

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('default', ['html', 'js', 'sass', 'connect', 'watch']);
