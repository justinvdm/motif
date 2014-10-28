{
  function parseString(s) {
    var lookup = options.lookup

    return lookup && s in lookup
      ? lookup[s]
      : s
  }
}


start
  = patterns
  / pattern


pattern
  = value
  / group


group
  = ws* '[' patterns:patterns? ']' ws*
  {
    return patterns
      ? patterns
      : []
  }


patterns
  = ws* first:pattern rest:(ws+ p:pattern { return p })+ ws*
  { return [first].concat(rest) }


ws 'whitespace' = [ \t\n\r]


value
  = number
  / string


number 'number'
  = sign? int frac? exp?
  { return parseFloat(text()); }


string 'string'
  = s:$(alphanumeric+ letter* alphanumeric*)
  { return parseString(s) }


digit  = [0-9]
point = '.'
sign = minus / plus
e = [eE]
exp = e (minus / plus)? digit+
frac = point digit+
int = digit+
minus = '-'
plus = '+'
zero = '0'


letter = [a-zA-Z]
alphanumeric = [a-zA-Z0-9]
