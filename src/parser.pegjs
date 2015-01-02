{
  var isArray = Array.isArray

  function parseString(s) {
    var lookup = options.lookup

    return lookup && s in lookup
      ? lookup[s]
      : s
  }


  function reattach(first, rest) {
    return [first].concat(rest)
  }


  function repeat(v, n) {
    var i = -1
    var result = []
    while (++i < n) result.push(copy(v))
    return result
  }


  function copy(v) {
    return isArray(v)
      ? extend([], v)
      : v
  }


  function extend(target, source) {
    var n = source.length
    var i = -1
    while (++i < n) target.push(source[i])
    return target
  }


  function append(target, source) {
    if (isArray(source)) extend(target, source)
    else target.push(source)
    return target
  }


  function flattenOnce(arr) {
    return arr.reduce(append, [])
  }


  function scale(arr, n) {
    var result = []
    var m = arr.length
    var restCount = (n / m) - 1
    var i = -1

    while (++i < m) {
      result.push(arr[i])
      extend(result, repeat([], restCount))
    }

    return result
  }


  function map(arr, fn) {
    var results = []
    var args = Array.prototype.slice.call(arguments, 2)
    var n = arr.length
    var i = -1
    while (++i < n) results.push(fn.apply(null, extend([arr[i]], args)))
    return results
  }


  function lcm(a, b) {   
    var tmp

    if (b > a) {
      tmp = a
      a = b
      b = tmp
    }

    var m = a
    while (m % b) m += a
    return m
  }


  function len(arr) {
    return arr.length
  }


  function equalize(groups) {
    var n = map(groups, len).reduce(lcm)
    return map(groups, scale, n)
  }


  function simplifyGroups(groups) {
    return equalize(groups).reduce(extend)
  }


  function addToBucket(arr, i, v) {
    var bucket = arr[i]
    if (typeof bucket == 'undefined') bucket = arr[i] = []
    append(bucket, v)
    return arr
  }


  function simplifyLayers(layers) {
    layers = equalize(layers)

    var result = []
    var n = layers.length
    var i = -1
    var layer, m, j

    while (++i < n) {
      layer = layers[i]
      m = layer.length
      j = -1

      while (++j < m) addToBucket(result, j, layer[j])
    }

    return result
  }
}


start = pattern


pattern
  = layers
  / layer

 
layers
  = first:layer rest:(',' l:layer { return l })+
  { return simplifyLayers(reattach(first, rest)) }


layer
  = groups:group+
  { return simplifyGroups(groups) }


group
  = segments
  / groupLiteral


segments
  = ws* first:segment rest:(ws+ s:segment { return s })* ws*
  { return reattach(first, rest).reduce(extend) }


segment
  = op
  / unit


op
  = repitition


repitition
  = operand:operand '*' n:number
  { return flattenOnce(repeat(operand, n)) }


operand
  = unit
  / groupLiteral


groupLiteral
  = ws* '[' pattern:pattern? ']' ws*
  { return pattern || [] }


ws 'whitespace' = [ \t\n\r]


unit
  = (p:primitive { return [[p]] })
  / (rest { return [[]] })


primitive
  = number
  / string


rest
  = '~'
  { return [] }


number 'number'
  = sign? int frac? exp?
  { return parseFloat(text()) }


int 'integer'
  = digit+
  { return parseInt(text()) }


string 'string'
  = s:$(alphanumeric+ letter* alphanumeric*)
  { return parseString(s) }


digit = [0-9]
point = '.'
sign = minus / plus
e = [eE]
exp = e (minus / plus)? digit+
frac = point digit+
minus = '-'
plus = '+'
zero = '0'


letter = [a-zA-Z]
alphanumeric = [a-zA-Z0-9]
