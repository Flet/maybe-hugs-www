#!/usr/bin/env node

var buildPath = 'build';
var fs = require('fs');
var path = require('path');
var sh = require('shelljs');
var writeHtml = require('./write-html.js');
var determineSyntax = require('./determine-syntax.js');

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

var SluggerUnique = require('slugger-unique');
var slugger = new SluggerUnique();

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

function convert (name, file) {
  var content = fs.readFileSync(file, {encoding: 'utf8'});
  writeHtml({slug: name, name: name, data: content, tocData: directories});
}

function processDirectory (name) {
  var dir = path.join(maybehug, name);
  var files = sh.ls('-R', dir);
  var data = '';

  files.forEach(function (f) {
    var filePath = path.join(dir, f);
    if (sh.test('-d', filePath)) return;

    var fileData = fs.readFileSync(filePath, {encoding: 'utf8'});

    if (fileData.length > '32000') {
      console.log('Whoa! this file is huge! ' + filePath + ' ' + fileData.length);
      fileData = 'Whoa, this file is big!\n\nView it at https://github.com/zkat/maybe-hugs/blob/master/' + f;
    }
    var content = '';

    if (f === 'README.md' || f === 'readme.markdown') {
      content = fileData;
      data = content + '\n' + data; // put README at the top
    } else {
      content += '###### ' + f + '\n\n';
      content += '```' + determineSyntax(filePath) + '\n';
      content += fileData;
      content += '\n```\n';
      data += content;
    }
  });

  data = '## ' + name + '\n\n' + data;

  var slug = customSlug(name);

  writeHtml({slug: slug, name: name, data: data, tocData: directories});
}

function customSlug (name) {
  var customName = name.replace(/\+/g, 'plus');
  return slugger.slug(customName);
}
