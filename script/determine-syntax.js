var path = require('path')

var langs = {
  'clj': 'clojure',
  'hs': 'haskell',
  'pm': 'perl',
  't': 'perl',
  'PL': 'perl',
  'rb': 'ruby',
  'rs': 'rust',
  'py': 'python'
}

module.exports = function (filePath) {
  var ext = path.extname(filePath).slice(1)
  return langs[ext] || ext
}
