var keystone = require('keystone');
var moment   = require('moment');
var debug    = require('debug')('bellefaire:event_page');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	var upcomingQuery = keystone.list('Event').model.published().find({endDate: {$gte: moment().startOf('day')}}).sort('startDate');
	view.query('upcomingEvents', upcomingQuery);
	
	var nextQuery = keystone.list('Event').model.published().findOne({
		startDate: { $gt: locals.page.startDate },
		_id: { $ne: locals.page.id }
	}).sort('startDate');
	view.query('nextEvent', nextQuery);

	var prevQuery = keystone.list('Event').model.published().findOne({
		startDate: { $lt: locals.page.startDate },
		_id: { $ne: locals.page.id }
	}).sort('-startDate');
	view.query('prevEvent', prevQuery);

	view.render('event_page');
};
