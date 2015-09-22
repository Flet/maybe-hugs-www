#!/usr/bin/env node

var buildPath = 'build'
var path = require('path')
var join = require('path').join
var sh = require('shelljs')
var SluggerUnique = require('slugger-unique')
var slugger = new SluggerUnique()
var processDirectory = require('./process-directory.js')

var maybehug = join('tmp', 'maybe-hugs')

if (!sh.which('git')) {
  sh.echo('Sorry, this script requires git')
  sh.exit(1)
}

if (sh.test('-d', maybehug)) {
  sh.pushd(maybehug)
  sh.exec('git pull')
  sh.popd()
} else {
  sh.exec('git clone https://github.com/zkat/maybe-hugs' + ' ' + maybehug)
}

sh.rm('-rf', buildPath)
sh.mkdir(buildPath)

var files = sh.ls(maybehug)

var directories = files.filter(function (file) {
  return sh.test('-d', join(maybehug, file))
})

var tocData = directories.map(function (item) {
  return {url: customSlug(item), title: item}
})
slugger.reset()

files.forEach(function (f) {
  var filePath = join(maybehug, f)
  if (f === 'README.md') {
    // processRootReadme(filePath)
    processDirectory('index', [filePath], tocData)
  } else if (sh.test('-d', filePath)) {
    // its a directory!
    console.log('process directory ' + filePath)
    var files = sh.find(join(maybehug, f))
    console.log('files', files)
    processDirectory(f, files, tocData)
  } else {
    console.log('nope!' + filePath)
  }
})

// once everything is built, copy it to root
sh.rm('../*.html')
sh.cp('-Rf', path.resolve(buildPath, '*'), path.resolve(__dirname, '..'))

function customSlug (name) {
  var customName = name.replace(/\+/g, 'plus')
  return slugger.slug(customName) + '.html'
}
