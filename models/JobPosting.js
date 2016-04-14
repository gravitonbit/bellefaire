var keystone = require('keystone');
var Types = keystone.Field.Types;
var BasePage = require('./BasePage');
var debug = require('debug')('bellefaire:JobPosting');

const JobCategory = new keystone.List('JobCategory', {
  map: { name: 'title' }
});
JobCategory.add({
	title: { type: Types.Text }
});
JobCategory.register();

const JobType = new keystone.List('JobType', {
  map: { name: 'title' }
});
JobType.add({
	title: { type: Types.Text }
});
JobType.register();

/**
 * JobPosting Model
 * ==========
 */

const JobPosting = new keystone.List('JobPosting', { inherits: BasePage });
JobPosting.add('Job Posting', {
	jobCategory: { type: Types.Relationship, ref: 'JobCategory', index: true},
	jobType: { type: Types.Relationship, ref: 'JobType', index: true},
	details: {
    type: Types.Html,
    collapse: true,
    wysiwyg: true
  },
});
JobPosting.schema.statics.view_name = 'job_posting';
JobPosting.register();
JobPosting.schema.pre('save', function(next) {
    var thisPage = this;
    thisPage.inNavigation = false;
    var q = keystone.list('JobsIndex').model.findOne().exec(function(err, result) {
      debug(result);
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



module.exports = JobPosting;