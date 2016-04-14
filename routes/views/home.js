var keystone = require('keystone');
var moment   = require('moment');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	var today = moment().startOf('day');
	var tomorrow = moment(today).add(1, 'days');

	view.query('alert', keystone.list('HomePageAlert').model.findOne({
		alertDate: {
			$gte: today.toDate(),
			$lt: tomorrow.toDate()
		}
	}));
	view.query('slides', keystone.list('HomePageSlide').model.find());

	var services = keystone.list('ServicePage').model.published();
	services.sort('sortOrder');
	view.query('services', services);
	view.query('page', keystone.list('HomePage').model.findOne().populate('storyWidget heroWidget'));

	var newsQuery = keystone.list('Article').model.published();
	newsQuery.populate('services');
	newsQuery.find({homepageFeature: true});
	newsQuery.limit(4);
	view.query('newsStories', newsQuery);

	var upcomingQuery = keystone.list('Event').model.published();
	upcomingQuery.find({endDate: {$gte: moment().startOf('day')}});
	upcomingQuery.find({homepageFeature: true});
	upcomingQuery.limit(4);
	view.query('upcomingEvents', upcomingQuery);

	view.render('home');
};
