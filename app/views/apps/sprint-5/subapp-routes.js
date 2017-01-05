const _ = require('lodash')
const thisAppData = require(__dirname + '/data.js')

/**
 * routes function for this particular 'subapp'
 * @method exports
 * @param  {object} router prototyping kit's routes app
 * @param  {object} config object of data for this particular subapp
 * @return {updated router}        express router
 */
module.exports = function(router, config) {
  
	// example of a route will be used on all pages within the subapp's views 
  router.all([config.route.page, config.route.root + '**/*'], function(req,res,next){
		
		_.merge(res.locals,{
			currentApp: {
				data: thisAppData
			}
		})
		
    next()
  
  });
	
	// you can write a route for specific pages/directories using the
	// config.route.root property. 
	// For example if you subapplication / version is in a directory 
	// called 'sprint1' then the output would be
	// /apps/sprint1/views/index
	router.all(config.route.root + 'index', function(req,res,next){
		next()
	})
  
	// handles the user login
	router.all(config.route.root + 'login', function(req,res,next){
		
		let postData = (req.body ? req.body : false)
		
		if(postData.username == 'paul.smith40@dwp.gsi.gov.uk') {
			console.log('Found the user!');
		}
		
		// redirect from login to this page
    return res.redirect('case-list')
		
		next()
	})

  return router
	
}