var keystone = require('keystone');
var Types = keystone.Field.Types;
var BasePage = require('./BasePage');

/**
 * NewsIndexPage Model
 * ==========
 */

var NewsIndexPage = new keystone.List('NewsIndexPage', { inherits: BasePage, nodelete: true });
NewsIndexPage.schema.statics.view_name = 'news_index';
NewsIndexPage.register();
module.exports = NewsIndexPage;