var keystone = require('keystone');
var Types = keystone.Field.Types;
var BasePage = require('./BasePage');

/**
 * TeamPage Model
 * ==========
 */

var TeamPage = new keystone.List('TeamPage', { inherits: BasePage });
TeamPage.add(
    {
        heading: 'Nav'
    },
    {
        parentId: { type: Types.Relationship, ref: 'BasePage', index: true, initial: true, hidden: false },
        inNavigation: { type: Boolean, default: false, hidden: false }
    }
);
TeamPage.schema.statics.view_name = 'team_page';
TeamPage.register();

module.exports = TeamPage;