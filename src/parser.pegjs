{
  var isArray = Array.isArray

  function parseString(s) {
    var lookup = options.lookup

    return lookup && s in lookup
      ? lookup[s]
      : s
  }


  function conj(first, rest) {
    return rest.length
      ? [first].concat(rest)
      : first
  }


  function repeat(v, n) {
    var i = -1
    var result = []
    while (++i < n) result.push(v)
    return result
  }


  function extend(target, source) {
    var n = source.length
    var i = -1
    while (++i < n) target.push(source[i])
    return target
  }


  function flattenOnce(arr) {
    var result = []
    var n = arr.length
    var i = -1
    var v

    while (++i < n) {
      v = arr[i]
      if (isArray(v)) extend(result, v)
      else result.push(v)
    }

    return result
  }
}


start = pattern


pattern
  = layers
  / groups
  / segments


layers
  = first:layer rest:(',' l:layer { return l })+
  { return conj(first, rest) }


layer
  = segments+


segments
  = ws* first:segment rest:(ws+ s:segment { return s })* ws*
  { return flattenOnce(first.concat(rest)) }


segment
  = repitition
  / (p:primary { return [p] })


repitition
  = primary:primary '*' n:int
  { return repeat(primary, n) }


primary
  = value
  / group


groups
  = first:group rest:(g:group { return g })*
  { return conj(first, rest) }


group
  = ws* '[' pattern:pattern? ']' ws*
  { return pattern || [] }


ws 'whitespace' = [ \t\n\r]


value
  = null
  / number
  / string


null
  = '~'
  { return null }


number 'number'
  = sign? int frac? exp?
  { return parseFloat(text()) }


string 'string'
  = s:$(alphanumeric+ letter* alphanumeric*)
  { return parseString(s) }


digit = [0-9]
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
