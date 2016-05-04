var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	view.query('departments', keystone.list('Department').model.find().sort('sortOrder').populate('contacts'));
	view.render('team_page');
};
