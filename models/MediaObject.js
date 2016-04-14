var keystone = require('keystone');
var Types = keystone.Field.Types;
var debug = require('debug')('bellefaire:MediaObject');
var ContentBlock = require('./ContentBlock');

/**
 * MediaItem Model
 * ==========
 */
 const MediaItem = new keystone.List('MediaItem', {
    map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true },
});
MediaItem.add({
    name: {
        type: String,
        required: true
    },
    mediaObject: {
        type: Types.Relationship,
        ref: 'MediaObject'
    },
    image: {
        collapse: true,
        type: Types.LocalFile,
        dest: 'data/uploads/static/mediaItems',
        prefix: '/static/mediaItems'
    },
    imageAlt: {
        label: 'Image Alt Text',
        collapse: true,
        type: String,
    },
    title: {
        type: String,
        collapse: true
    },
    content: {
        label: 'Content',
        type: Types.Html,
        collapse: true,
        wysiwyg: true
    }
});
MediaItem.register();

/**
 * MediaObject Model
 * ==========
 */
const MediaObject = new keystone.List('MediaObject', { inherits: ContentBlock });
MediaObject.relationship({ path: 'mediaItems', ref: 'MediaItem', refPath: 'mediaObject' });
MediaObject.register();

module.exports = MediaObject;