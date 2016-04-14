var keystone    = require('keystone');
var _           = require('underscore');
var moment      = require('moment');
var debug       = require('debug')('bellefaire:event_index');
var querystring = require('querystring');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	var filterMoment = moment();
	if(req.query.y) {
		filterMoment.year(parseInt(req.query.y));
	}
	if(req.query.m) {
		filterMoment.month(parseInt(req.query.m) - 1);
	}
	if(req.query.d) {
		filterMoment.date(parseInt(req.query.d));
	}

	locals.filters = {
		year: filterMoment.year(),
		month: filterMoment.month(),
		date: filterMoment.date(),
		service: req.query.service,
	};

	var featuredEventsQuery = keystone.list('Event').paginate({
		page: req.query.page || 1,
		perPage: 6,
		filters: {'state':'published'}
	});

	featuredEventsQuery.where('state', 'published');
	featuredEventsQuery.populate('services');
	featuredEventsQuery.sort('startDate -publishedDate -createdAt');
	
	if(locals.filters.service) {
		view.on('init', function(next) {
			keystone.list('ServicePage').model.published().findOne({slug: locals.filters.service}).exec(function(err, result) {
				if(!result) {
					return next('Unable to find Service!');
				}
				featuredEventsQuery.where('service').in([result]);
				next(err);
			});
		});
	}

	view.query('services', keystone.list('ServicePage').model.published());
	view.query('featuredEvents', featuredEventsQuery);

	// Load events on the current date
	var currentEventQuery = keystone.list('Event').model.published();

	var dateStart = moment({year: locals.filters.year, month: locals.filters.month, d: locals.filters.date});
	var dateEnd = moment(dateStart).add(1, 'd');
	currentEventQuery.where('startDate').lte(dateEnd.toDate());
	currentEventQuery.where('endDate').gte(dateStart.toDate());

	view.query('currentEvents', currentEventQuery);

	// Get a list of available event dates
	keystone.list('Event').model.published().find().select('startDate endDate').exec(function(err, results) {
		debug(results);
		var uniqueDates = [];
		for(var result of results) {
			var startDate = moment(result.startDate);
			var endDate = moment(result.endDate).add(1, 'days');
			for(var curDate = startDate; curDate.isBefore(endDate); curDate.add(1, 'days')) {
				uniqueDates.push(curDate.format('YYYY-MM-DD'));
			}
		}
		uniqueDates = _.chain(uniqueDates).uniq().map(function(date) {
			return moment(date).toObject();
		}).value();
		locals.availableDates = JSON.stringify(uniqueDates);
	});

	view.render('event_index');
};
