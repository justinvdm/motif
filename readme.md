# motif

![Build Status](https://api.travis-ci.org/justinvdm/motif.png)

pattern composition mini-language for javascript

```javascript
var assert = require('assert')
var motif = require('motif')

assert.deepEqual(
  motif('[a  b], [[[c d] [e], f]*3, g], h'),
  [['a', 'c', 'f', 'g', 'h'],
   ['d'],
   ['e'],
   [],
   ['c', 'f'],
   ['d'],
   ['b', 'e'],
   [],
   ['c', 'f'],
   ['d'],
   ['e'],
   []])
```

motif is heavily inspired by [Tidal](https://github.com/tidalcycles/Tidal/blob/master/doc/tidal.md). The parser is generated via [PEG.js](http://pegjs.org/).

## docs

  - [install](#install)
  - [api](#api)
  - [language](#language)


## install

node:

```
$ npm install motif
```

browser:

```
$ bower install motif-js
```

```html
<script src="/bower_components/motif-js/motif.js"></script>
```

## api

### ``motif(pattern[, lookup])``

```javascript
motif('a b')
// => [['a'], ['b']]
```

Compiles the given `pattern` string into a javascript object.

If a `lookup` object is given, the value of each symbol given in the lookup object will replace the symbol's occurences in the pattern.


```javascript
motif('a b', {
  a: 23,
  b: 42,
})

// => [[23], [42]]
```

## language

### compilation result (buckets)

All motif patterns produce an array of 'bucket' arrays, where a bucket represents things that occur simultaneously. In the context of music, this would mean a series of notes played at the same time. In the example below, `'a'` and `'c'` are in the same bucket, so they would be played at the same time.

```javascript
motif('a b, c')

// => [['a', 'c'], ['b']]
```

### primitives

#### numbers

Numbers are a primitive type in the language. Like javascript, numbers can have an optional sign, an integer part, an optional fraction part and an optional exponent.

```javascript
motif('23')
// => [[23]]
```

#### strings

Strings are another primitive type in the language. Strings can be any series of alphanumeric characters apart from cases containing only numbers.

```javascript
motif('l3mon')
// => [['l3mon']]
```

If a corresponding symbol exists for the string in a lookup object given to `motif`, the string representation is replaced by the symbol.

```javascript
motif('a b c', {
  a: 23,
  b: 42,
})

// => [[23], [42], ['c']]
```

### rests

A rest produces an empty bucket. `~` is the symbol used for a rest. In the context of music, this would mean a time interval where no notes are played.

```javascript
motif('a ~ b')
// => [['a'], [], ['b']]
```

### operations

#### repitition

A repitition is an operation used to duplicate a pattern a number of times. Repititions can be any primitive, rest or group literal followed by a `*`, then an integer.

```javascript
motif('[a b]*3')
// => [['a'], ['b'], ['a'], ['b'], ['a'], ['b']]
```

### groups

Groups define pattern segments of the same 'length'. In the context of music, this would mean groups of things which should be played one after the other, each at an equivalent amount of time.

A group can be any combination of whitespace separated primitives, rests, operations, or group literals, where a group literal is a nested motif pattern enclosed inside square brackets (`[` and `]`).

Group literals and whitespace allow one to form multiple groups. In the example below, the following patterns are equivalent, where `[a b]`, `[c d]` and `[e f g]` are the groups in each pattern.

```javascript
motif('[a b] [c d] [e f g]')
motif('a b [c d] [e f g]')
motif('a b [c d] e f g')
```

In the example below, `[a]` has a rest added to it (it essentially becomes `[a ~]`) so that has the same length as `[b c]`.

```javascript
motif('[a] [b c]'),
// this simplifies to: '[a ~] [b c]'
// then simplifies to: '[a] [] [b] [c]'
// then compiles to: [['a'], [], ['b'], ['c']])
```

### layers

Layers define pattern segments which should overlap. In the context of music, this would mean two different rhythms, possibly of different lengths, that are played simultaneously.

A layer is recognised as one or more groups. Multiple layers are recognised as layers separated by `,` characters (with any number of whitespace characters before and after).

In the example below, `a` and `b` would occur simulataneously.

```javascript
motif('a, b'),
// => [['a', 'b']])
```

As is the case with groups, layers are simplified to be of the same 'length'. In the example below, `a` has a rest added to it to give it the same length as `[b c]`. From there, buckets are formed from the two layers, so `a` and `b` get played together, and `c` gets played alone (`[a]` is concatenated with `[b]` and `[]` is concatenated with `[c]`).

```javascript
motif('[a], [b c]'),
// this simplifies to: '[a ~], [b c]'
// then simplifies to: '[a] [], [b] [c]'
// then compiles to: [['a', 'b'], ['c']]
```
