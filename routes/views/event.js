var keystone = require('keystone'),
		published_filter = require('../lib/published_filter'),
		content_blocks = require('../lib/content_blocks');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
			locals = res.locals;

	// Set locals
	locals.filters = {
		year: parseInt(req.params.year),
		month: parseInt(req.params.month),
		slug: req.params.slug
	};
	locals.data = {};

	view.on('init', function(next) {
		var q = keystone.list('Event').model.published().findOne({
			fullPath: locals.full_path
		}).populate('blocks');
		published_filter(req.user, q);

		q.exec(function(err, result) {

			if (!result) {
				return res.notfound();
			}

			content_blocks.fetchContentBlocks(result, function() {
				locals.page = result;
				next(err);
			});
		});

	});

	// Render the view
	view.render('event');

};
