var keystone 	= require('keystone');
var _           = require('underscore');
var moment      = require('moment');
var debug 		= require('debug')('bellefaire:service_page');
var querystring = require('querystring');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.filters = {};
	locals.filters.service = req.originalUrl.split('/')[2];
	locals.filters.page = req.query.page || 1;

	var base_query = _.clone(req.query);
	delete base_query.page;
	locals.base_qs = querystring.stringify(base_query);

	var resourcesQuery = keystone.list('Article').paginate({
		page: locals.filters.page,
		perPage: 7
	});

	resourcesQuery.sort('-publishedDate -createdAt');
	resourcesQuery.populate('services');

	view.on('init', function(next){
		keystone.list('ServicePage').model.published().findOne({ slug: locals.filters.service }).exec(function(err, result) {
				if(result) {
					//console.log('Service Filter: ' + result.slug);
					resourcesQuery.where('services').in([result]);
					resourcesQuery.limit(3);
				}
			next(err);
		});
	});

	view.on('render', function(next) {
		locals.page.populate('blocks', function(err) {
			next(err);
		});
	});

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

	// console.log (req.query)

	locals.filters = {
		year: filterMoment.year(),
		month: filterMoment.month(),
		date: filterMoment.date(),
		service: locals.filters.service,
		page: 1
	};

	if (req.query.page) {
		// console.log('has page')
		locals.filters.page = req.query.page
	}

	// console.log (locals.filters)

	var featuredEventsQuery = keystone.list('Event').paginate({
		page: locals.filters.page,
		perPage: 6
	}).model.published().populate('service');

	featuredEventsQuery.sort('startDate -publishedDate -createdAt');
	featuredEventsQuery.where('startDate').gte(new Date());
	featuredEventsQuery.limit(3);
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

	var services = keystone.list('ServicePage').model.published();

	view.query('resources', resourcesQuery);

	view.query('services', services);

	view.render('service_page');
};
