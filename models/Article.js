var keystone = require('keystone');
var Types = keystone.Field.Types;
var moment = require('moment');
var BasePage = require('./BasePage');

/**
 * Article Categories
 * ============
 */
const ArticleCategory = new keystone.List('ArticleCategory', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true }
});
ArticleCategory.add({
  title: { type: Types.Text },
  slug: { type: String }
});
ArticleCategory.register();

/**
 * Article Model
 */
var Article = new keystone.List('Article', { inherits: BasePage });


Article.add(
    {
        parentId: { type: Types.Relationship, ref: 'BasePage', index: true, initial: false, noedit: true },
    }
);

/**
 * Article Fields
 */
Article.add({
  homepageFeature: { type: Boolean, default: false },
  content: { type: Types.Html, collapse: true, wysiwyg: true },
  previewText: { type: Types.Textarea, collapse: true, },
  services: { type: Types.Relationship, ref: 'ServicePage', index: true, many: true },
  category: { type: Types.Relationship, ref: 'ArticleCategory', index: true, many: true },
});

Article.schema.statics.view_name = 'news_page';
Article.register();

Article.schema.pre('save', function(next) {
  var thisPage = this;
  var pubDate = moment(this.publishedDate);
  var fullSlug = pubDate.year() + '/' +
                  (pubDate.month()+1) + '/' +
                  pubDate.date() + '/' +
                  thisPage.slug;
  var q = keystone.list('NewsIndexPage').model.findOne().exec(function(err, result) {
    if (result) {
      thisPage.parentId = result;
      thisPage.fullPath = result.fullPath + fullSlug + '/';
    } else {
      thisPage.fullPath = '/news/' + fullSlug + '/';
    }
    if(err) {
      debug(err);
    }
    next(err);
  });
});
