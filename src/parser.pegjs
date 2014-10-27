{
  function parseString(s) {
    var lookup = options.lookup

    return lookup && s in lookup
      ? lookup[s]
      : s
  }
}


pattern = value


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
