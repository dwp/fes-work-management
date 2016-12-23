const _ = require('lodash')

/**
 * routes function for this particular 'subapp'
 * @method exports
 * @param  {object} router prototyping kit's routes app
 * @param  {object} config object of data for this particular subapp
 * @return {updated router}        express router
 */
module.exports = function(router, config) {
  
	// this route will be used on all pages within the subapp's views 
  router.all(config.route.page, function(req,res,next){
    
    let postData = req.body ? req.body : {}
		let currentPage = req.params.page
    
    if(currentPage == "index") {
      console.log('It\'s the index page');
    }
    
    next()
  
  });

  return router
	
}