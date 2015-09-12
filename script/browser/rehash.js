module.exports = rehash

// inspired by:
// https://github.com/npm/newww/blob/ebbe8a3344341b08026d03c67cfe53e541e88283/assets/scripts/deep-links.js
// TODO: make this its own npm package!

// auto-generated DOM ids are prefixed with `user-content-` for security reasons
// this checks whether someone has clicked on an auto-generated id, and updates
// the URL fragment to not include the prefix.

var hashchange = require('hashchange')
var domReady = require('detect-dom-ready')

function rehash (prefix) {
  hashchange.update(function (hash) {
    var prefix = prefix || 'user-content-'

    if (hash.indexOf(prefix) === 0) {
      hashchange.updateHash(hash.replace(prefix, ''))
    } else {
      var anchor = document.getElementById(prefix + hash)
      if (anchor) {
        window.scrollTo(window.scrollX, anchor.getBoundingClientRect().top + window.scrollY)
      }
    }
  })

  domReady(function () {
    hashchange.update()
  })
}
