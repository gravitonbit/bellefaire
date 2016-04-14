var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Departments
 * ============
 */
const Department = new keystone.List('Department', {
  map: { name: 'title' }
});
Department.add({
  title: { type: Types.Text },
  contactInfo: { type: Types.Textarea },
  icon: {
    type: Types.LocalFile,
    dest: 'data/uploads/static/departmentIcon',
    prefix: '/static/departmentIcon'
  },
  color: {
    type: Types.Color,
    default: '#6c689f'
  },
  contacts: { type: Types.Relationship, ref: 'TeamMember', many: true }
});
Department.register();