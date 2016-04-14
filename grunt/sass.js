module.exports = {
	options: {
		sourceMap: true
	},
	dist: {
    options: {
      style: 'expanded'
    },
    files: {
      'public/styles/site.css': 'public/styles/site.scss',
    }
  }
};
