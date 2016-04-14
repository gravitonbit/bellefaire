var keystone = require('keystone');
var ContentBlock = require('./ContentBlock');
var Types = keystone.Field.Types;

/**
 * Press Topics
 * ============
 */
const PressTopic = new keystone.List('PressTopic', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true }
});
PressTopic.add({
	title: { type: Types.Text },
	slug: { type: String }
});
PressTopic.register();

/**
 * Press Model
 * =============
 */
const PressArticle = new keystone.List('PressArticle', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
  track: true
});

PressArticle.add({
	title: { type: Types.Text },
	slug: { type: String },
	date: { type: Types.Datetime },
	description: { type: Types.Text },
  pressLink: { type: Types.Url },
  topic: { type: Types.Relationship, ref: 'PressTopic', index: true, many: true },
});

PressArticle.register();