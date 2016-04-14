var keystone = require('keystone');
var Types = keystone.Field.Types;
var NestedSetPlugin = require('mongoose-nested-set');
var async = require('async');
var debug = require('debug')('bellefaire:BasePage');

/**
 * BasePage Model
 * ==========
 */

var BasePage = new keystone.List('BasePage', {
  map: { name: 'name' },
  autokey: { path: 'slug', from: 'title', unique: true },
  sortable: true,
  sortContext: 'BasePage:childPages',
  track: true
});

BasePage.add({
    name: { type: String, required: true },
    title: { type: String, required: true, initial: true },
    slug: { type: String },
    fullPath: { type: String, noedit: true },
    author: { type: Types.Relationship, ref: 'User', index: true },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
    publishedDate: { type: Types.Datetime, index: true, default: Date.now, dependsOn: { state: 'published' } },
    metaDescription: { type: String, collapse: true },
    metaKeywords: { type: String, collapse: true },
});

BasePage.add(
    {
        parentId: { type: Types.Relationship, ref: 'BasePage', index: true, hidden: true },
        inNavigation: { type: Boolean, default: false, hidden: true }
    }
);

BasePage.schema.virtual('href').get(function() {
    return this.fullPath;
});
// Full Text search
BasePage.schema.index({"$**": "text"});

BasePage.defaultColumns = 'name, title, state';

BasePage.schema.statics.published = function() {
  return this.find({state: 'published', publishedDate: { $lte: new Date()}});
};

BasePage.register();

BasePage.schema.pre('save', function(next) {
  var thisPage = this;
  BasePage.model.findOne({_id: thisPage.parentId}).exec(function(err, result){
    if (result) {
      thisPage.fullPath = result.fullPath + thisPage.slug + '/';
    } else {
      thisPage.fullPath = '/' + thisPage.slug + '/';
    }
    next(err);
  });
});

module.exports = BasePage;