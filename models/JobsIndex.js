var keystone = require('keystone');
var Types = keystone.Field.Types;
var BasePage = require('./BasePage');

/**
 * JobsIndex Model
 * ==========
 */

var JobsIndex = new keystone.List('JobsIndex', { inherits: BasePage });
JobsIndex.add(
    {
        parentId: { type: Types.Relationship, ref: 'BasePage', index: true, hidden: false },
        inNavigation: { type: Boolean, default: false, hidden: false }
    }
);
JobsIndex.schema.statics.view_name = 'jobs_index';
JobsIndex.register();

module.exports = JobsIndex;