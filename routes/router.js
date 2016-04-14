var keystone = require('keystone');
var debug = require('debug')('bellefaire:router');
var _ = require('underscore');
var async = require('async');
var views = keystone.importer(__dirname)('./views');

function loadBreadcrumb(page, locals, next) {
	var breadcrumb = [];
	var oldestAncestor = page;
	breadcrumb.push({title: oldestAncestor.title, href: oldestAncestor.href});
	async.whilst(
		function() {
			return oldestAncestor && oldestAncestor.parentId;
		},
		function(cb) {
			keystone.list('BasePage').model.findOne({_id: oldestAncestor.parentId}).exec(function(err, result){
				oldestAncestor = keystone.list('BasePage').model(result);
				breadcrumb.push({title: oldestAncestor.title, href: oldestAncestor.href});
				cb(err);
			});
		},
		function(err) {
			if(err) {
				return next(err);
			}
			breadcrumb.push({title: 'Home', href: '/'});
			breadcrumb.reverse();
			locals.breadcrumb = breadcrumb;
			next();
		}
	);
}

/*
 * This module provides a router that will map model types to views
 */
exports = module.exports = function(req, res) {
	var locals = res.locals;

	var q = keystone.list('BasePage').model.published().findOne({
		fullPath: locals.full_path
	}).populate('service services author keyContacts blocks');
	q.exec(function(err, result){
		locals.page = result;

		if (!locals.page) {
			return res.notfound();
		}
		var pageBlocks = locals.page.blocks || [];
		async.each(pageBlocks, function(block, callback) {
			if (block.__t === 'MediaObject') {
				keystone.list('MediaItem').model.find({mediaObject: block.id}).sort('sortOrder').exec(function(err, mediaItems) {
					block.mediaItems = mediaItems;
					callback(err);
				});
			} else {
				callback();
			}
		}, function(err) {
			debug(locals.page.constructor.view_name);
			loadBreadcrumb(locals.page, locals, function(err) {
				if(err) {
					debug(err);
				}
				if(locals.page.constructor.view_name) {
					return views[locals.page.constructor.view_name](req, res);
				} else {
					return views.standard_page(req, res);
				}
			});
		});
	});

};
