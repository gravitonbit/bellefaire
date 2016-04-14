module.exports = {
	execMap: {
		js: 'traceur-runner'
	},
	debug: {
		script: 'keystone.js',
		options: {
			nodeArgs: ['--debug'],
			env: {
				port: 3000
			}
		}
	}
};
