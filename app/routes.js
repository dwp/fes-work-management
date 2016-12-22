const path = require('path')
const express = require('express')
const router = express.Router()
const app = express()
const glob = require('globby')
const _ = require('lodash')
const appsDir = 'apps'
const sentenceCase = require('sentence-case')
let subApps = new Array();

/**
 * massages a data object from a given path of a routes file
 * @method getSubAppData
 * @param  {string}       path the system path of the routes file passed in
 * @return {object}            data derrived from the routes file and it's path
 */
getSubAppData = function(currentPath) {
  
	var splitPathArray = currentPath.split('/');
	
	// this takes the file path and returns the relative path to it 
	// within the prototyping kit 
  var computedPath = _.join( 
			_.slice( 
				splitPathArray, ( 
					_.indexOf(splitPathArray, 'views') +1 
				) 
			),
		'/' 
	);
	
	// gets the sub directory name
	var appDirName = computedPath.split('/')[1];
	// the 'absolute' path of the app e.g '/apps/version-1/'
	var appAbsolutePath = '/' + appsDir + '/' + appDirName + '/';
	// the 'absolute' path of the app view directory e.g '/apps/version-1/views/'
	var appRouteString = appAbsolutePath + 'views/';
	// the title based on the app's directory/folder name. Set to be sentance-case
	var title = sentenceCase(appDirName);
	
	// returns and object of data derrived from the subapp path that was passed in
  return {
		
		// a formatted string for the title of the subapp
		title: title,
		
		// the directory name for the subapp
    appDirName: appDirName,
		
		// a string used to give the app a unique body class
		body_class: title.replace(/\s+/g, '-').toLowerCase(),
		
		// url paths constructed from the passed in subapp path
		urlPaths: {
			appRoot: appAbsolutePath,
			assetsPath: appAbsolutePath + 'assets/',
			scriptsPath: appAbsolutePath + 'assets/javascripts/',
			stylesPath: appAbsolutePath + 'assets/sass/',
			imagesPath: appAbsolutePath + 'assets/images/'
		},
		
		// file paths, to be used primarily by nunjucks for rendering layouts,
		// accessing routes, etc. 
		filePaths: {
			routesFile: computedPath,
			layoutsDir: path.dirname(computedPath) + '/layouts/',
			coreLayoutsDirPathRel: path.relative(path.dirname(currentPath + '/layouts/'), __dirname + '/views/layouts/')
		},
		
		// route strings
		route: {
			root: appRouteString,
			page: appRouteString + ':page'
		}
		
  }
	
}

/**
 * this route is a fudge to be able to serve the assets without editing the 
 * gov.uk prototying kit's server.js file to specifically serve the usuaul way
 *  using static middleware.
 */
router.get('/apps/:subapp*/assets/:type/:file*', function(req, res){
	var requestedFile = __dirname + '/views/apps/' + req.params.subapp + '/assets/' + req.params.type + '/' + req.params.file;
  // Don't let them peek at /etc/passwd
  if (req.params.file.indexOf('..') === -1) {
    return res.sendfile(requestedFile);
  } else {
    res.status = 404;
    return res.send('Not Found');
  }
})

/**
 * loop over the sub 'routes' files and add them to the overall router
 */
glob.sync(__dirname + '/views/' + appsDir +'/**/*-routes.js').forEach(function(currentPath){
  
	// get some data based on the current subapp path
	var appData = getSubAppData(currentPath);
	
	// push that to a collection of all the subapps
	subApps.push(appData);

	// require the current subapp's routes file passing the overall app router
	// and the subapp's data object
	require(currentPath)(router, appData);
	
	// no matter what the app, always add the following context data about the 
	// apps and the app currently being viewed
	router.all([
		appData.urlPaths.appRoot + '*', 
		appData.urlPaths.appRoot + 'views/*'
	], function(req, res, next){
		
	  _.merge(res.locals, {
			session: req.session,
	    currentApp: appData
	  });
	  
		next();
		
	});
	
	// if the user hits the root of the subapp's views, then redirect to the
	// index page
	router.all(appData.route.root, function(req,res,next){
		return res.redirect('index');
	});
	
});

// Route index page
router.get('/', function (req, res) {
  res.locals.apps = subApps;
  return res.render('index')
})

module.exports = router
