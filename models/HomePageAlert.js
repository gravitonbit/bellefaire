var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * HomePageAlert Model
 * ==========
 */
const HomePageAlert = new keystone.List('HomePageAlert', {
    map: { name: 'description' },
    track: true
});
HomePageAlert.add({
    description: { type: String, required: true },
    alertDate: { type: Types.Date, index: true, default: Date.now },
    link: { type: Types.Url }
});
HomePageAlert.defaultColumns = 'description';
HomePageAlert.register();

module.exports = HomePageAlert;