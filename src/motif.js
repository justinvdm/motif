motif.SyntaxError = parser.SyntaxError


function motif(pattern) {
  return parser.parse(pattern)
}
