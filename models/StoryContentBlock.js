var keystone = require('keystone');
var ContentBlock = require('./ContentBlock');
var Types = keystone.Field.Types;


/**
 * Hero Model
 * =============
 */
const StoryContentBlock = new keystone.List('StoryContentBlock', { inherits: ContentBlock });

StoryContentBlock.add({
    description: { type: Types.Text },
    readMoreLink: { type: Types.Text },
    viewMoreLink: { type: Types.Text },
});

StoryContentBlock.register();