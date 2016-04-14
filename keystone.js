// require('babel/register');
// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');
var cons = require('consolidate');
var nunjucks = require('nunjucks');

var path = require('path');
var postcssMiddleware = require('postcss-middleware');
var autoprefixer = require('autoprefixer')({ browsers: ['> 1%', 'IE 7'], cascade: false });
var sassMiddleware = require('node-sass-middleware');

var watchNunjucks = process.env.NODE_ENV !== 'production';
cons.requires.nunjucks = nunjucks.configure({watch: watchNunjucks});
cons.requires.nunjucks.addFilter('nl2br', function(str) {
	if(!str) {
		return str;
	} else {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
	}
});

keystone.init({

	'name': 'Bellefaire JCB',
	'brand': 'Bellefaire JCB',
	
  'static': ['public', 'data/uploads'],
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'html',
	'custom engine': cons.nunjucks,
	
	'wysiwyg images': true,
  'wysiwyg additional buttons': 'formatselect',
  'wysiwyg additional plugins': 'paste',
  'wysiwyg additional options': {
    'block_formats': "Paragraph=p;Header 1=h2;Header 2=h3;Header 3=h4",
  },
	'auto update': true,
	'session': true,
	'session store': 'mongo',
	'auth': true,
	'user model': 'User',
	'cookie secret': '^q3sXf_oU%GlE=h2I;z-}830%(Q|(ry_#kKEeXTk^$vE!|eZ^uA~F4rku?uaR5h0'

});

keystone.import('models');

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

keystone.set('routes', require('./routes'));

keystone.set('nav', {
	'pages': ['standard-pages', 'service-pages'],
	'content-blocks': ['story-content-blocks','media-objects','hero-content-blocks','three-cols','left-asides','right-asides','full-widths'],
	'articles': ['articles','article-categories'],
	'events': 'events',
	'jobs': ['job-postings', 'job-categories', 'job-types'],
	'press': ['press-articles', 'press-topics'],
	'contact': ['contact-pages', 'departments', 'contact-locations', 'team-members'],
	'home': ['home-pages', 'home-page-slides'],
	'listing-pages': ['search-pages','team-pages','press-pages','news-index-pages','jobs-indices','event-pages'],
});

keystone.start();


