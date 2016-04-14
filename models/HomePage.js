var keystone = require('keystone');
var Types = keystone.Field.Types;
var BasePage = require('./BasePage');

/**
 * HomePage Model
 * ==========
 */

var HomePage = new keystone.List('HomePage', { inherits: BasePage });
HomePage.add({
	storyWidget: { type: Types.Relationship, ref: 'StoryContentBlock' },
	heroWidget: { type: Types.Relationship, ref: 'HeroContentBlock' }
});
HomePage.add('Lead', {
	lead: {
		title: { type: Types.Text },
		copy: { type: Types.Text }
	}
});
HomePage.add('Snippet', {
	snippet: {
		title: { type: Types.Text },
		videoEmbed: { type: Types.Html },
		image: {
        collapse: true,
        type: Types.LocalFile,
        dest: 'data/uploads/static/homeSnippetImage',
        prefix: '/static/homeSnippetImage'
    },
    linkText: { type: Types.Text },
    link: { type: Types.Url },
    description: { type: Types.Text }
	}
});
HomePage.add('Newsletter', {
	newsletterEmbed: { type: Types.Html }
});
HomePage.schema.statics.view_name = 'home';
HomePage.register();

module.exports = HomePage;