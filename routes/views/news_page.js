var keystone    = require('keystone');
var _           = require('underscore');
var moment      = require('moment');
var debug       = require('debug')('bellefaire:news_page');
var querystring = require('querystring');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	view.query('services', keystone.list('ServicePage').model.published());
	view.query('categories', keystone.list('ArticleCategory').model.find());


	var nextArticleQuery = keystone.list('Article').model.published().findOne({
		publishedDate: { $gt: locals.page.publishedDate },
		_id: { $ne: locals.page.id }
	}).sort('publishedDate');
	view.query('nextArticle', nextArticleQuery);

	var prevArticleQuery = keystone.list('Article').model.published().findOne({
		publishedDate: { $lt: locals.page.publishedDate },
		_id: { $ne: locals.page.id }
	}).sort('-publishedDate');
	view.query('prevArticle', prevArticleQuery);

	view.render('news_page');
};
