module.exports.create = function (page, partials) {
  return new HtmlWriter(page, partials)
}

var extend = require('xtend')
var hb = require('handlebars')
var marky = require('marky-markdown')

function HtmlWriter (page, partials) {
  this.genPage = hb.compile(page)

  console.log('partials', partials)
  Object.keys(partials).forEach(function (p) {
    hb.registerPartial(p, partials[p])
  })

  hb.registerHelper('markdown', function (data) {
    return new hb.SafeString(marky(data).html())
  })
}

HtmlWriter.prototype.convert = function (passedOpts) {
  var opts = extend(passedOpts)
  return this.genPage(opts)
}
