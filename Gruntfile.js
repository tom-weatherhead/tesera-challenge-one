'use strict';

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		eslint: {
			target: [
				'*.js',
				'src/*.js',
				'test/*.js'
			]
		},
		mochaTest: {
			options: {
				reporter: 'spec'
			},
			test: {
				src: ['test/*_spec.js']
			}
		},
		nsp: {
			package: grunt.file.readJSON('package.json')
		}
	});

	// Tasks
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-nsp');

	// Aliases
	grunt.registerTask('test', ['eslint', 'mochaTest', 'nsp']);
	grunt.registerTask('default', ['test']);
};
