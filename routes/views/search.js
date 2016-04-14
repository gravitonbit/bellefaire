var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.query = req.query.q;
	var searchQuery = keystone.list('BasePage').model.published().find({
		$text: { $search: locals.query }
	});
	view.query('results', searchQuery);
	view.render('search_results');
};
