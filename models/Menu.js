var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Menu Model
 * ==========
 */
const Menu = new keystone.List('Menu', {
    map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true },
    track: true
});
Menu.add({
    name: { type: String, required: true },
    slug: { type: String, readonly: true },
    pages: { type: Types.Relationship, ref: 'BasePage', many: true }
});
Menu.defaultColumns = 'name';
Menu.register();

module.exports = Menu;