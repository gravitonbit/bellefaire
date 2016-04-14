var keystone    = require('keystone');
var _           = require('underscore');
var moment      = require('moment');
var debug       = require('debug')('bellefaire:news_index');
var querystring = require('querystring');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.filters = {};
	locals.filters.service = req.query.service;
	locals.filters.category = req.query.category;
	locals.filters.page = req.query.page || 1;

	var base_query = _.clone(req.query);
	delete base_query.page;
	locals.base_qs = querystring.stringify(base_query);

	var articleQuery = keystone.list('Article').paginate({
		page: locals.filters.page,
		perPage: 7,
	});
	articleQuery.sort('-publishedDate -createdAt');
	articleQuery.populate('services');

	view.on('init', function(next) {
		keystone.list('ServicePage').model.published().findOne({ slug: locals.filters.service }).exec(function(err, result) {
			if(result) {
				debug('Service Filter: ' + result.slug);
				articleQuery.where('services').in([result]);
			}
			next(err);
		});
	});
	
	if(locals.filters.category){
		articleQuery.populate('category');
		keystone.list('ArticleCategory').model.findOne({ slug: locals.filters.category }).exec(function(err, result) {
			if(result) {
				debug('Service Filter: ' + result.slug);
				articleQuery.where('category').in([result]);
			}
		});
	}

	view.query('articles', articleQuery);

	view.query('services', keystone.list('ServicePage').model.published());
	
	view.query('categories', keystone.list('ArticleCategory').model.find());

	view.render('news_index');
};
