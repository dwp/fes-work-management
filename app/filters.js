const slug = require('slug')
const _ = require('lodash')

module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  var filters = {}
  
  filters.slug = function(input, options){
    let defaultOptions = {
      lower: true
    }
    return slug(input, options ? _.merge(defaultOptions, options) : defaultOptions)
  };

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
