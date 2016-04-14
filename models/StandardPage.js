var keystone = require('keystone');
var Types = keystone.Field.Types;
var BasePage = require('./BasePage');
var debug = require('debug')('bellefaire:StandardPage');

/**
 * StandardPage Model
 * ==========
 */

var StandardPage = new keystone.List('StandardPage', { inherits: BasePage });
StandardPage.add(
    {
        heading: 'Nav'
    },
    {
        parentId: { type: Types.Relationship, ref: 'BasePage', index: true, initial: true, hidden: false },
        inNavigation: { type: Boolean, default: false, hidden: false }
    }
);
StandardPage.add(
    {
        heading: 'Hero',
    },
    {
        hasHero: {
            type: Types.Boolean,
            default: false
        },
        heroTitle: {
            type: String,
            collapse: true,
            dependsOn: { hasHero: true }
        },
        heroDescription: {
            type: String,
            collapse: true,
            dependsOn: { hasHero: true }
        },
        heroButtonText: {
            type: String,
            collapse: true,
            dependsOn: { hasHero: true }
        },
        heroButtonUrl: {
            type: String,
            collapse: true,
            dependsOn: { hasHero: true }
        },
    }
);
StandardPage.add(
    'Blocks',
    {
        blocks: { type: Types.Relationship, ref: 'ContentBlock', many: true }
    }
);

StandardPage.schema.statics.view_name = 'standard_page';
StandardPage.register();
module.exports = StandardPage;