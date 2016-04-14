var keystone    = require('keystone');
var _           = require('underscore');
var moment      = require('moment');
var debug       = require('debug')('bellefaire:press_page');
var querystring = require('querystring');

function loadDates(view, locals) {
  // Load dates available from the archive
	view.on('init', function(next) {
		var q = keystone.list('PressArticle',{defaultSort:'date'}).model.find().select('date');
		q.exec(function(err, articles) {
			// Set archive to be an object indexed by year with an array of months as the value
			// i.e. {2012: [4, 5], 2014: [1, 2, 3, 12]}
			var yearGroups = _.chain(articles)
				.sortBy('date')
				.pluck('date')
				.map(function(date) {
					return moment(date);
				})
				.unique(function(item){
					return item.year() + "-" + item.month();
				})
				.groupBy(function(item) {
					return item.year();
				})
				.value();

			locals.data.archive = yearGroups;

			next();
		});
	});

}

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.data = {};
	locals.filters = {};

	if (req.query.year) {
		locals.filters.year = parseInt(req.query.year);
		locals.filters.month = parseInt(req.query.month) - 1; // Javascript months are zero indexed
	}
	locals.filters.topic = req.query.topic;
	locals.filters.page = req.query.page || 1;

	// Load the base querystring without page for pagination
	var base_query = _.clone(req.query);
	delete base_query.page;
	locals.base_qs = querystring.stringify(base_query);

	loadDates(view, locals);

	view.query('topics', keystone.list('PressTopic').model.find());

	var topicQuery = keystone.list('PressArticle').paginate({
		page: locals.filters.page,
		perPage: 7
	});
	topicQuery.sort('-date');
	topicQuery.populate('topic');

	if (locals.filters.year && locals.filters.month) {
		debug("Archive Filters: " + locals.filters.year + "/" + locals.filters.month);
		var minDate = moment({year: locals.filters.year, month: locals.filters.month, d: 0});
		var maxDate = moment(minDate).add(1, 'M');
		topicQuery.where('date').gte(minDate.toDate()).lte(maxDate.toDate());
	}

	view.on('init', function(next) {
		keystone.list('PressTopic').model.findOne({ slug: locals.filters.topic }).exec(function(err, result) {
			if(result) {
				debug('Topic Filter: ' + result.slug);
				topicQuery.where('topic').in([result]);
			}
			next(err);
		});
	});

	view.query('articles', topicQuery);

	view.render('press_page');
};
