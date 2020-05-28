const parser = require('./parser.pegjs')

motif.SyntaxError = parser.SyntaxError

function motif(pattern, lookup) {
  return parser.parse(pattern, { lookup: lookup })
}

module.exports = motif
