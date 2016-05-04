var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Team Members
 * ============
 */
const TeamMember = new keystone.List('TeamMember', {
  map: { name: 'name' },
  sortable: true
});
TeamMember.add({
	name: { type: Types.Text },
	contactInfo: { type: Types.Textarea },
	photo: {
    type: Types.LocalFile,
    dest: 'data/uploads/static/teamMemberPhoto',
    prefix: '/static/teamMemberPhoto'
  },
  keyMember: {type: Types.Boolean}
});
TeamMember.register();
