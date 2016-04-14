var keystone = require('keystone');
var Types = keystone.Field.Types;
var debug = require('debug')('bellefaire:HorizontalRule');
var ContentBlock = require('./ContentBlock');

/**
 * HorizontalRule Model
 * ==========
 */
const HorizontalRule = new keystone.List('HorizontalRule', {
    inherits: ContentBlock,
});
HorizontalRule.register();

module.exports = HorizontalRule;