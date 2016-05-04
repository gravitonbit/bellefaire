var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Contact Page Locations
 * ============
 */
const ContactLocation = new keystone.List('ContactLocation', {
  map: { name: 'title' },
  sortable: true
});
ContactLocation.add({
	title: { type: Types.Text },
	address: { type: Types.Text },
	mapImage: {
    type: Types.LocalFile,
    dest: 'data/uploads/static/mapImages',
    prefix: '/static/mapImages'
  },
});
ContactLocation.register();
