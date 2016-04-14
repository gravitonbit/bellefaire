var keystone = require('keystone');
var Types = keystone.Field.Types;
var BasePage = require('./BasePage');

/**
 * SearchPage Model
 * ==========
 */

var SearchPage = new keystone.List('SearchPage', { inherits: BasePage });
SearchPage.schema.statics.view_name = 'search';
SearchPage.register();

module.exports = SearchPage;