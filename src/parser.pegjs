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
    var nullCount = (n / m) - 1
    var i = -1

    while (++i < m) {
      result.push(arr[i])
      extend(result, repeat(null, nullCount))
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
    if (typeof bucket == 'undefined') bucket = arr[i] = null

    if (v !== null) {
      if (bucket === null) bucket = arr[i] = []
      append(bucket, v)
    }

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

 
groups
  = groups:group+
  { return simplifyGroups(groups) }


layers
  = first:layer rest:(',' l:layer { return l })+
  { return simplifyLayers(conj(first, rest)) }


layer
  = segments
  / groups


segments
  = ws* first:segment rest:(ws+ s:segment { return s })* ws*
  { return flattenOnce(first.concat(rest)) }


segment
  = op
  / (v:value { return [v] })


ops
  = ops:op+
  { return flattenOnce(ops) }


op
  = repitition


repitition
  = operand:operand '*' n:number
  { return flattenOnce(repeat(operand, n)) }


operand
  = value
  / group


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
