module.exports = processDirectory

var fs = require('fs')
var join = require('path').join
var path = require('path')
var sh = require('shelljs')
var determineSyntax = require('./determine-syntax.js')
var SluggerUnique = require('slugger-unique')
var slugger = new SluggerUnique()

var markybars = require('./markybars.js')
var page = join('template/page.html')
var partials = {
  'toc': join('template/toc.html')
}

var genPage = markybars.compile(page, partials)

function processDirectory (groupname, files, tocData) {
  var data = ''
  var hasReadme = false

  files.forEach(function (filePath) {
    var name = path.parse(filePath).base

    if (sh.test('-d', filePath)) return

    var fileData = fs.readFileSync(filePath, {encoding: 'utf8'})

    if (fileData.length > '32000') {
      console.log('Whoa! this file is huge! ' + filePath + ' ' + fileData.length)
      fileData = 'Whoa, this file is big!\n\nView it at https://github.com/zkat/maybe-hugs/blob/master/' + name
    }
    var content = ''

    if (name === 'README.md' || name === 'readme.markdown') {
      hasReadme = true
      content = fileData
      data = content + '\n' + data // put README at the top
    } else {
      content += '###### ' + name + '\n\n'
      content += '```' + determineSyntax(filePath) + '\n'
      content += fileData
      content += '\n```\n'
      data += content
    }
  })

  if (!hasReadme) data = '## ' + groupname + '\n\n' + data

  var slug = customSlug(groupname)

  var htmlData = genPage({data: data, nav: tocData})
  fs.writeFileSync(join('build', slug), htmlData, {encoding: 'utf8'})
}

function customSlug (name) {
  var customName = name.replace(/\+/g, 'plus')
  return slugger.slug(customName) + '.html'
}
