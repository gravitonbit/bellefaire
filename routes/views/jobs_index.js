var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);

	var locals = res.locals;
	locals.filters = {};
	locals.filters.page = req.query.page || 1;

	var jobsQuery = keystone.list('JobPosting').paginate({
		page: locals.filters.page,
		perPage: 25
	}).populate('jobCategory jobType');
	view.query('jobs', jobsQuery);
	view.render('jobs_index');
};
