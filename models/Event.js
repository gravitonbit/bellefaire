var keystone = require('keystone');
var Types = keystone.Field.Types;
var moment = require('moment');
var BasePage = require('./BasePage');

/**
 * Event Model
 */
var Event = new keystone.List('Event', { inherits: BasePage });


Event.add(
    {
        parentId: { type: Types.Relationship, ref: 'BasePage', index: true, initial: false, noedit: true },
    }
);

/**
 * Event Fields
 */
Event.add(
  'Event Details',
  {
    homepageFeature: { type: Boolean, default: false },
    startDate: { type: Types.Date, index: true, required: true, initial: true },
    endDate: { type: Types.Date, required: true, initial: true },
    time: { type: String },
    location: { type: String },
    previewText: { type: String },
    previewImage: {
        collapse: true,
        type: Types.LocalFile,
        dest: 'data/uploads/static/eventImages',
        prefix: '/static/eventImages'
    },
    details: {
      type: Types.Html,
      collapse: true,
      wysiwyg: true
    },
    service: { type: Types.Relationship, ref: 'ServicePage', index: true },
  }
);

Event.schema.statics.view_name = 'event_page';
Event.register();

Event.schema.pre('save', function(next) {
  var thisPage = this;
  var q = keystone.list('EventPage').model.findOne().exec(function(err, result) {
    if (result) {
      thisPage.parentId = result;
      thisPage.fullPath = result.fullPath + thisPage.slug + '/';
    } else {
      thisPage.fullPath = '/events/' + thisPage.slug + '/';
    }
    if(err) {
      debug(err);
    }
    next(err);
  });
});
