var path = require('path')
var express = require('express')
var router = express.Router()
var app = express()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

/**
 * this route is a fudge to be able to serve the assets without editing the 
 * gov.uk prototying kit's server.js file to specifically serve this using
 * the static middleware.
 */
router.get('/:subapp*/assets/:type/:file*', function(req, res){
	var requestedFile = __dirname + '/views/' + req.params.subapp + '/assets/' + req.params.type + '/' + req.params.file;
  // Don't let them peek at /etc/passwd
  if (req.params.file.indexOf('..') === -1) {
    return res.sendfile(requestedFile);
  } else {
    res.status = 404;
    return res.send('Not Found');
  }
})

// add your routes here

module.exports = router
