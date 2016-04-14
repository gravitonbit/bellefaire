var keystone = require('keystone');
var Types = keystone.Field.Types;
var BasePage = require('./BasePage');

/**
 * PressPage Model
 * ==========
 */

var PressPage = new keystone.List('PressPage', { inherits: BasePage });
PressPage.add('Press Kit', {
	pressKitLink: { type: Types.Url },
	pressKitDescription: { type: Types.Text }
});
PressPage.schema.statics.view_name = 'press_page';
PressPage.register();
module.exports = PressPage;