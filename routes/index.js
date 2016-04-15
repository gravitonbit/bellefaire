var keystone = require('keystone');
var router = require('./router');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var postcssMiddleware = require('postcss-middleware');
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var autoprefixer = require('autoprefixer')({ browsers: ['> 1%', 'IE 7'], cascade: false });

/**/
// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.lowercaseUrlMiddleware);
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {
  app.use(sassMiddleware({
    src: path.join(__dirname, '..', 'public', 'styles'),
    dest: path.join(__dirname, '..', 'public', 'styles', 'sass_build'),
    prefix: '/styles',
    response: false
  }));
  app.use('/styles', postcssMiddleware({
    src: function(req) {
      return path.join('..', 'public', 'styles', 'sass_build', req.path);
    },
    plugins: [autoprefixer]
  }));
	// Views
	app.get('/', routes.views.home);
	app.get('/*', router);

};
