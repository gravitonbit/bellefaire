var _        = require('underscore');
var keystone = require('keystone');
var BasePage = keystone.list('BasePage');
var Menu     = keystone.list('Menu');
var debug    = require('debug')('bellefaire:middleware');
var async    = require('async');

/**
	Initialises the standard view locals
*/
exports.initLocals = function(req, res, next) {

	var locals = res.locals;
	
	locals.user = req.user;
	locals.hostname = req.get('host');
	locals.base_url = req.protocol + "://" + locals.hostname;
	locals.full_url = locals.base_url + req.path;
	locals.full_path = req.path;

	// Either pull the full path slug from the path, or redirect to add a trailing '/'
	if(locals.full_path[locals.full_path.length - 1] !== '/') {
		if(locals.full_path.lastIndexOf("/keystone", 0) !== 0) {
			return res.redirect(locals.full_path + '/');
		}
	}
	locals.section_slug = locals.full_path.split("/")[1];

	Menu.model.find().populate('pages').exec(function(err, results) {
		if (results.length === 0) return next();

		locals.nav = _.reduce(results, function(memo, value) {
			memo[value.slug] = value;
			return memo;
		}, {});
		if(locals.nav.primary) {
			async.each(locals.nav.primary.pages, function(page, callback) {
				BasePage.model.published().find({parentId: page._id, inNavigation: true}).sort('sortOrder').exec(function(err, data){
						page.navChildren = data;
						callback(err);
				});
			}, function(err) {
				return next(err);
			});
		} else {
			return next();
		}
	});
};

/**
	Redirect to URL's in all lowercase
*/
exports.lowercaseUrlMiddleware = function(req, res, next) {
	if(/[A-Z]/.test(req.path)) {
		return res.redirect(req.path.toLowerCase());
	}
	next();
};

/**
	Inits the error handler functions into `res`
*/
exports.initErrorHandlers = function(req, res, next) {

  res.err = function(err, title, message) {
    res.status(500).render('errors/500', {
      err: err,
      errorTitle: title,
      errorMsg: message
    });
  };

  res.notfound = function() {
    res.status(404).render('errors/404');
  };

  next();

};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {

	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};

	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;

	next();

};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {

	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}

};
