var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * FileObject Model
 * ==========
 */
const FileObject = new keystone.List('FileObject', {
    map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true },
    track: true
});
FileObject.add({
  name: { type: String, required: true },
  slug: { type: String, readonly: true },
  fullUrl: { type: String, readonly: true },
	file: {
    type: Types.LocalFile,
    dest: 'data/uploads/static/fileObjects',
    prefix: '/static/fileObjects'
  },
});
FileObject.defaultColumns = 'name';
FileObject.register();

FileObject.schema.pre('save', function(next) {
  this.fullUrl = '/static/fileObjects/' + this.file.filename;
  next();
});

module.exports = FileObject;