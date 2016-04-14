var keystone = require('keystone');
var Types = keystone.Field.Types;
var BasePage = require('./BasePage');
var Color = require('color');
var debug = require('debug')('bellefaire:ServicePage');

/**
 * ServicePage Model
 * ==========
 */

var ServicePage = new keystone.List('ServicePage', { inherits: BasePage });
ServicePage.add(
    {
        parentId: { type: Types.Relationship, ref: 'BasePage', index: true, hidden: true },
        inNavigation: { type: Boolean, default: true, hidden: true }
    }
);
ServicePage.add(
    {
        heading: 'Hero',
    },
    {
        hasHero: {
            type: Types.Boolean,
            default: true,
            hidden: true
        },
        heroTitle: {
            type: String,
            hidden: true,
        },
        heroDescription: {
            type: String,
        }
    }
);
ServicePage.add(
  'Service Details',
  {
    serviceIcon: {
        collapse: true,
        type: Types.LocalFile,
        dest: 'data/uploads/static/serviceIcons',
        prefix: '/static/serviceIcons'
    },
    serviceColor: { type: Types.Text },
    serviceColorDark: { type: Types.Text }
  }
);
ServicePage.add(
    'Blocks',
    {
        blocks: { type: Types.Relationship, ref: 'ContentBlock', many: true }
    }
);
ServicePage.schema.statics.view_name = 'service_page';
ServicePage.register();
module.exports = ServicePage;

ServicePage.schema.pre('save', function(next) {
    var thisPage = this;
    thisPage.inNavigation = true;
    if(!this.serviceColorDark && this.serviceColor) {
        var darkColor = Color(this.serviceColor);
        var saturationv = darkColor.saturationv();
        debug('Pre-color: ' + darkColor.hsvArray());
        darkColor.saturationv(saturationv * 1.1);
        darkColor.rotate(-2);
        darkColor.darken(0.1);
        debug('Post-color: ' + darkColor.hsvArray());
        this.serviceColorDark = darkColor.hexString();
    }
    var q = keystone.list('BasePage').model.findOne({slug: 'programs-and-services'}).exec(function(err, result) {
        if (result) {
            thisPage.parentId = result;
            thisPage.fullPath = result.fullPath + thisPage.slug + '/';
        }
        if(err) {
            debug(err);
        }
        next(err);
    });
});