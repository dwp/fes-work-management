// Check for `node_modules` folder and warn if missing

var path = require('path')
var fs = require('fs')

if (!fs.existsSync(path.join(__dirname, '/node_modules'))) {
  console.error('ERROR: Node module folder missing. Try running `npm install`')
  process.exit(0)
}

process.env['FORCE_COLOR'] = 1
var spawn = require('child_process').spawn;
var gulpDefault = spawn('gulp', ['default']);
var gulpSubApp = spawn('gulp', ['subapp']);

gulpSubApp.stdout.pipe(gulpDefault.stdin);
gulpDefault.stdout.pipe(process.stdin);