// require('babel/register');
// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');
var cons = require('consolidate');
var nunjucks = require('nunjucks');
const util = require('util');

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
cons.requires.nunjucks.addFilter('revertSort', function(val, case_sensitive, by) {
	if (!util.isObject(val)) {
    console.error('revertSort filter: val must be an object');
  }

  var array = [];
  for (var k in val) {
    // deliberately include properties from the object's prototype
    array.push([k,val[k]]);
  }

  var si;
  if (by === undefined || by === 'key') {
    si = 0;
  } else if (by === 'value') {
    si = 1;
  } else {
    console.error('dictsort filter: You can only sort by either key or value');
  }

  array.sort(function(t1, t2) {
    var a = t1[si];
    var b = t2[si];

    if (!case_sensitive) {
      if (util.isString(a)) {
        a = a.toUpperCase();
      }
      if (util.isString(b)) {
        b = b.toUpperCase();
      }
    }

    return a < b ? 1 : (a === b ? 0 : -1);
  });

  return array;
});

cons.requires.nunjucks.addFilter('formatUrl', function(str) {
	var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(str && str.match(pattern)) {
		return 'mailto:' + str;
	}else{
		return str;
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
