module.exports = {
	options: {
		reporter: require('jshint-stylish'),
		force: true,
		esnext: true,
	},
	all: [ 'routes/**/*.js',
				 'models/**/*.js'
	],
	server: [
		'./keystone.js'
	]
}
