var keystone = require('keystone');
var Types = keystone.Field.Types;
var BasePage = require('./BasePage');

/**
 * ContactPage Model
 * ==========
 */

var ContactPage = new keystone.List('ContactPage', { inherits: BasePage });
ContactPage.add({
	formEmbed: { type: Types.Html }
});
ContactPage.add('Contacts', {
	keyContacts: { type: Types.Relationship, ref: 'TeamMember', many: true }
});
ContactPage.schema.statics.view_name = 'contact_page';
ContactPage.register();
module.exports = ContactPage;