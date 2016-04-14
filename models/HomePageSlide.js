var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Departments
 * ============
 */
const HomePageSlide = new keystone.List('HomePageSlide', {
  map: { name: 'title' }
});
HomePageSlide.add({
	title: { type: Types.Text },
	link: { type: Types.Url },
	slideImage: {
    type: Types.LocalFile,
    dest: 'data/uploads/static/slideImage',
    prefix: '/static/slideImage'
  },
});
HomePageSlide.register();