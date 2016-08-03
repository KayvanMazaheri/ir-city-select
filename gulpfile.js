const DataRepo = 'git@github.com:pesarkhobeee/iran-states-and-cities-json-and-sql-including-area-coordinations.git';
const DataFile = 'iran_cities_with_coordinates.json';

var gulp = require('gulp');
var git = require('gulp-git');
var del = require('del');
var insert = require('gulp-insert');
var change = require('gulp-change');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('clean:temp', function() {
	return del(['temp/**/*']);
});

gulp.task('clone:repo', ['clean:temp'], function(done) {
	git.clone(DataRepo, {args: './temp/repo'}, function(err) {
		if(err)
			throw err;
		done();
	});
});

var prepareData = function(content) {
	var original = JSON.parse(content);
	var result = {};

	for (var i = 0; i < original.length; i++) {
		var province = original[i].name;
		result[province] = [];
		var cities = original[i].cities;
		for (var j = 0; j < cities.length; j++) {
			var city = cities[j].name;
			result[province].push(city);
		}
	}
	return JSON.stringify(result);
};

gulp.task('prepare:data', ['clone:repo'], function() {
	return gulp.src('temp/repo/*.json')
		.pipe(change(prepareData))
		.pipe(rename({basename:'data'}))
		.pipe(gulp.dest('temp/'));
});

gulp.task('add:data', ['prepare:data'], function() {
	var data = require('./temp/data.json');
	
	if(!data)
		throw 'data.json is not available';

	var line = 'var data = ' + JSON.stringify(data) + ';\n'
	
	return gulp.src('index.js')
		.pipe(rename({basename:'ir-city-select'}))
		.pipe(insert.prepend(line))
		.pipe(gulp.dest('dist/'))
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest('dist/'));
});


gulp.task('default', ['add:data']);