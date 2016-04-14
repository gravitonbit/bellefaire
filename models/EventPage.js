var keystone = require('keystone');
var Types = keystone.Field.Types;
var BasePage = require('./BasePage');

/**
 * EventPage Model
 * ==========
 */

var EventPage = new keystone.List('EventPage', { inherits: BasePage, nocreate: true, nodelete: true });
EventPage.schema.statics.view_name = 'event_index';
EventPage.register();
module.exports = EventPage;