var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	view.query('jobCategory', keystone.list('JobCategory').model.findById(locals.page.jobCategory));
	view.query('jobType', keystone.list('JobType').model.findById(locals.page.jobType));
	view.render('job_posting');
};
