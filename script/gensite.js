#!/usr/bin/env node

var buildPath = 'build';
var fs = require('fs');
var path = require('path');
var sh = require('shelljs');
var writeHtml = require('./write-html.js');

var maybehug = path.join('tmp', 'maybe-hugs');

if (!sh.which('git')) {
  sh.echo('Sorry, this script requires git');
  sh.exit(1);
}

if (sh.test('-d', maybehug)) {
  sh.pushd(maybehug);
  sh.exec('git pull');
  sh.popd();
} else {
  sh.exec('git clone https://github.com/zkat/maybe-hugs' + ' ' + maybehug);
}

sh.rm('-rf', buildPath);
sh.mkdir(buildPath);

var files = sh.ls(maybehug);

var directories = files.filter(function (file) {
  return sh.test('-d', path.join(maybehug, file));
});

// build an html file for each directory
directories.forEach(processDirectory);

files.forEach(function (f) {
  var filePath = path.join(maybehug, f);
  if (f === 'README.md') {
    convert('index', filePath);
  }

  if (sh.test('-d', filePath)) {
    // its a directory!
    console.log('process directory ' + filePath);
    processDirectory(f, filePath);
  } else {
    console.log('nope!' + filePath);
  }

});

// once everything is built, copy it to root
sh.rm('../*.html');
sh.cp('-Rf', path.resolve(buildPath, '*'), path.resolve(__dirname, '..'));
sh.cp('-Rf', path.resolve('template', '*.css'), path.resolve(__dirname, '..'));

function convert (name, file) {
  var content = fs.readFileSync(file, {encoding: 'utf8'});
  writeHtml({name: name, data: content, tocData: directories});
}

function processDirectory (name) {
  var dir = path.join(maybehug, name);
  var files = sh.ls('-R', dir);
  console.log('processing dir');

  var data = '';

  files.forEach(function (f) {
    var filePath = path.join(dir, f);
    if (sh.test('-d', filePath)) return;

    var fileData = fs.readFileSync(filePath, {encoding: 'utf8'});
    var content = '';
    
    if (f === 'README.md') {
      content = fileData;
      data = content + data; // put README at the top
    } else {
      content += '### ' + f + '\n\n';
      content += '```' + path.extname(filePath) + '\n';
      content += fileData;
      content += '```\n\n\n';
      data += content
    }

  });

  data = '## ' + name + '\n\n' + data

  writeHtml({name: name, data: data, tocData: directories});
}
