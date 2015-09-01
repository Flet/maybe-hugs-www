module.exports = writeHtml;

var extend = require('xtend');
var fs = require('fs');
var hb = require('handlebars');
var marked = require('marked');
var path = require('path');
var slug = require('slugg');
var highlightjs = require('highlight.js');

marked.setOptions({
  highlight: function (code, lang) {
    return highlightjs.highlightAuto(code, [ lang ]).value;
  },
  langPrefix: 'hljs ' // le sigh: https://github.com/chjj/marked/pull/418
});

hb.registerHelper('markdown', function (data) {
  return new hb.SafeString(marked(data));
});

var toc = fs.readFileSync(path.join('template', 'toc.html'), {encoding: 'utf8'});
var page = fs.readFileSync(path.join('template', 'page.html'), {encoding: 'utf8'});
hb.registerPartial('toc', toc);
var genPage = hb.compile(page);

function writeHtml (passedOpts) {
  var opts = extend(passedOpts);

  opts.nav = opts.tocData.map(function (item) {
    return {url: customSlug(item) + '.html', title: item};
  });

  var output = genPage(opts);

  var name = customSlug(opts.name) + '.html';
  console.log('writing ' + name);
  fs.writeFileSync(path.join('build', name), output, {encoding: 'utf8'});
}

function customSlug (name) {
  var customName = name.replace(/\+/g, 'plus');
  return slug(customName);
}
