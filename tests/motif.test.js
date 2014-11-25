var motif = require('../motif')
var assert = require('assert')


describe("motif", function() {
  it("should support numbers", function() {
    assert.deepEqual(motif('0'), [0])
    assert.deepEqual(motif('00023'), [23])
    assert.deepEqual(motif('23'), [23])
    assert.deepEqual(motif('+23'), [23])
    assert.deepEqual(motif('23.23'), [23.23])
    assert.deepEqual(motif('-23.23e-23'), [-23.23e-23])
  })

  it("should support strings", function() {
    assert.deepEqual(motif('fooBarBaz'), ['fooBarBaz'])
    assert.deepEqual(motif('fooB4rB4z'), ['fooB4rB4z'])
  })

  it("should support nulls", function() {
    assert.deepEqual(motif('~'), [null])
    assert.deepEqual(motif('~ ~ ~'), [null, null, null])
    assert.deepEqual(motif('~  ~  ~  '), [null, null, null])

    assert.deepEqual(
        motif('~ a ~ b ~ c ~'),
        [null, 'a', null, 'b', null, 'c', null])
  })

  it("should support lookup values", function() {
    assert.deepEqual(
        motif('a b', {
          a: 23,
          b: 42,
        }),
        [23, 42])
  })

  it("should support single level patterns", function() {
    assert.deepEqual(motif('a b'), ['a', 'b'])
    assert.deepEqual(motif('a b c'), ['a', 'b', 'c'])
    assert.deepEqual(motif('  a  b  c  '), ['a', 'b', 'c'])
  })

  it("should support groups", function() {
    assert.deepEqual(motif('[]'), [])
    assert.deepEqual(motif('[a b c]'), ['a', 'b', 'c'])
    assert.deepEqual(motif('  [  a  b  c ]  '), ['a', 'b', 'c'])
    assert.deepEqual(motif('[a b] [c d]'), ['a', 'b', 'c', 'd'])

    assert.deepEqual(
        motif('[a b] [c d e]'),
        ['a', null, null, 'b', null, null, 'c', null, 'd', null, 'e', null])

    assert.deepEqual(
        motif('[a b] [c d] [e f]'),
        ['a', 'b', 'c', 'd', 'e', 'f'])

    assert.deepEqual(
        motif('[a b] [[c d] [e]]'),
        ['a', null, 'b', null, 'c', 'd', 'e', null])

    assert.deepEqual(
        motif('[a  b] [[c  d] [e f g]]'),
        ['a', null, null, null, null, null,
         'b', null, null, null, null, null,
         'c', null, null,
         'd', null, null,
         'e', null,
         'f', null,
         'g', null
        ])
  })

  it("should support layers", function() {
    assert.deepEqual(motif('a, b'), [['a', 'b']])
    assert.deepEqual(motif('a, b, c'), [['a', 'b', 'c']])

    assert.deepEqual(motif('a b, c'), [['a', 'c'], ['b']])
    assert.deepEqual(motif('a,b,c'), [['a', 'b', 'c']])
    assert.deepEqual(motif('  a  ,  b  ,  c  '), [['a', 'b', 'c']])

    assert.deepEqual(
        motif('a  b, [c d, e f g]'),
        [['a', 'c', 'e'], null, ['f'], ['b', 'd'], ['g'], null])

    assert.deepEqual(
        motif('[a  b] [c d e], [f g] [h i]'),
        [['a', 'f'], null, null,
         ['b', 'g'], null, null,
         ['c', 'h'], null,
         ['d'], ['i'], ['e'], null])

    assert.deepEqual(
        motif('[a  b], [[[c d] [e], f], g], h'),
        [['a', 'c', 'f', 'g', 'h'], ['d'], ['b', 'e'], null])
  })

  it("should support repitition", function() {
    assert.deepEqual(motif('a*3'), ['a', 'a', 'a'])
    assert.deepEqual(motif('a*3 b'), ['a', 'a', 'a', 'b'])
    assert.deepEqual(motif('a b*3 c'), ['a', 'b', 'b', 'b', 'c'])

    assert.deepEqual(
        motif('a*10'),
        ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'])

    assert.deepEqual(
        motif('a [b c]*3 d'),
        ['a', 'b', 'c', 'b', 'c', 'b', 'c', 'd'])

    assert.deepEqual(
        motif('[a b]*3'),
        ['a', 'b', 'a', 'b', 'a', 'b'])

    assert.deepEqual(
        motif('[a b]*2 [c d]*3'),
        ['a', 'b', 'a','b', 'c','d', 'c', 'd', 'c', 'd'])

    assert.deepEqual(
        motif('[a b]*2, [c d]*2'),
        [['a', 'c'], ['b', 'd'], ['a', 'c'], ['b', 'd']])

    assert.deepEqual(
        motif('a [b c, d]*3 e'),
        ['a',
        ['b', 'd'], ['c'],
        ['b', 'd'], ['c'],
        ['b', 'd'], ['c'],
         'e'])
  })
})
