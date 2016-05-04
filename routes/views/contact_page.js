var keystone    = require('keystone');
var _           = require('underscore');
var moment      = require('moment');
var debug       = require('debug')('bellefaire:event_index');
var querystring = require('querystring');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	view.query('locations', keystone.list('ContactLocation').model.find().sort('sortOrder'));
	view.query('departments', keystone.list('Department').model.find().sort('sortOrder'));
	view.query('keyContacts', keystone.list('TeamMember').model.find().where('keyMember', true).sort('sortOrder'));

	view.render('contact_page');
};
