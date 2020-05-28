const motif = require('..')
const it = require('ava')

it('should support numbers', t => {
  t.deepEqual(motif('0'), [[0]])
  t.deepEqual(motif('00023'), [[23]])
  t.deepEqual(motif('23'), [[23]])
  t.deepEqual(motif('+23'), [[23]])
  t.deepEqual(motif('23.23'), [[23.23]])
  t.deepEqual(motif('-23.23e-23'), [[-23.23e-23]])
})

it('should support strings', t => {
  t.deepEqual(motif('fooBarBaz'), [['fooBarBaz']])
  t.deepEqual(motif('fooB4rB4z'), [['fooB4rB4z']])
})

it('should support rests', t => {
  t.deepEqual(motif('~'), [[]])
  t.deepEqual(motif('~ ~ ~'), [[], [], []])
  t.deepEqual(motif('~  ~  ~  '), [[], [], []])

  t.deepEqual(motif('~ a ~ b ~ c ~'), [[], ['a'], [], ['b'], [], ['c'], []])
})

it('should support object lookup values', t => {
  t.deepEqual(
    motif('a b 23 23.23', {
      a: 23,
      b: 42,
      23: 'foo',
      23.23: 'bar'
    }),
    [[23], [42], ['foo'], ['bar']]
  )
})

it('should support array lookup values', t => {
  t.deepEqual(motif('1 0 1 2', ['a', 'b', 'c', 'd']), [
    ['b'],
    ['a'],
    ['b'],
    ['c']
  ])
})

it('should support single level patterns', t => {
  t.deepEqual(motif('a b'), [['a'], ['b']])
  t.deepEqual(motif('a b c'), [['a'], ['b'], ['c']])
  t.deepEqual(motif('  a  b  c  '), [['a'], ['b'], ['c']])
})

it('should support groups', t => {
  t.deepEqual(motif('[]'), [])
  t.deepEqual(motif('[a b c]'), [['a'], ['b'], ['c']])
  t.deepEqual(motif('  [  a  b  c ]  '), [['a'], ['b'], ['c']])
  t.deepEqual(motif('[a b] [c d]'), [['a'], ['b'], ['c'], ['d']])

  t.deepEqual(motif('a [b c]'), [['a'], [], ['b'], ['c']])

  t.deepEqual(motif('a b [c d]'), [['a'], ['b'], ['c'], ['d']])

  t.deepEqual(motif('a [b c] d e'), [['a'], [], ['b'], ['c'], ['d'], ['e']])

  t.deepEqual(motif('a [b c [d e]] f'), [
    ['a'],
    [],
    [],
    [],
    ['b'],
    ['c'],
    ['d'],
    ['e'],
    ['f'],
    [],
    [],
    []
  ])

  t.deepEqual(motif('[a b] [c d e]'), [
    ['a'],
    [],
    [],
    ['b'],
    [],
    [],
    ['c'],
    [],
    ['d'],
    [],
    ['e'],
    []
  ])

  t.deepEqual(motif('[a b] [c d] [e f]'), [
    ['a'],
    ['b'],
    ['c'],
    ['d'],
    ['e'],
    ['f']
  ])

  t.deepEqual(motif('[a b] [[c d] [e]]'), [
    ['a'],
    [],
    ['b'],
    [],
    ['c'],
    ['d'],
    ['e'],
    []
  ])

  t.deepEqual(motif('[a  b] [[c  d] [e f g]]'), [
    ['a'],
    [],
    [],
    [],
    [],
    [],
    ['b'],
    [],
    [],
    [],
    [],
    [],
    ['c'],
    [],
    [],
    ['d'],
    [],
    [],
    ['e'],
    [],
    ['f'],
    [],
    ['g'],
    []
  ])
})

it('should support layers', t => {
  t.deepEqual(motif('a, b'), [['a', 'b']])
  t.deepEqual(motif('a, b, c'), [['a', 'b', 'c']])
  t.deepEqual(motif('a b, c'), [['a', 'c'], ['b']])
  t.deepEqual(motif('a,b,c'), [['a', 'b', 'c']])
  t.deepEqual(motif('  a  ,  b  ,  c  '), [['a', 'b', 'c']])

  t.deepEqual(motif('a  b, [c d, e f g]'), [
    ['a', 'c', 'e'],
    [],
    ['f'],
    ['b', 'd'],
    ['g'],
    []
  ])

  t.deepEqual(motif('[a  b] [c d e], [f g] [h i]'), [
    ['a', 'f'],
    [],
    [],
    ['b', 'g'],
    [],
    [],
    ['c', 'h'],
    [],
    ['d'],
    ['i'],
    ['e'],
    []
  ])

  t.deepEqual(motif('[a  b], [[[c d] [e], f], g], h'), [
    ['a', 'c', 'f', 'g', 'h'],
    ['d'],
    ['b', 'e'],
    []
  ])
})

it('should support repitition', t => {
  t.deepEqual(motif('a*3'), [['a'], ['a'], ['a']])
  t.deepEqual(motif('a*3 b'), [['a'], ['a'], ['a'], ['b']])
  t.deepEqual(motif('a b*3 c'), [['a'], ['b'], ['b'], ['b'], ['c']])

  t.deepEqual(motif('a*10'), [
    ['a'],
    ['a'],
    ['a'],
    ['a'],
    ['a'],
    ['a'],
    ['a'],
    ['a'],
    ['a'],
    ['a']
  ])

  t.deepEqual(motif('a*3 [b c]'), [
    ['a'],
    [],
    ['a'],
    [],
    ['a'],
    [],
    ['b'],
    [],
    [],
    ['c'],
    [],
    []
  ])

  t.deepEqual(motif('a [b c]*3 d'), [
    ['a'],
    ['b'],
    ['c'],
    ['b'],
    ['c'],
    ['b'],
    ['c'],
    ['d']
  ])

  t.deepEqual(motif('[a b]*3'), [['a'], ['b'], ['a'], ['b'], ['a'], ['b']])

  t.deepEqual(motif('[a b] [b c]*3'), [
    ['a'],
    [],
    [],
    ['b'],
    [],
    [],
    ['b'],
    ['c'],
    ['b'],
    ['c'],
    ['b'],
    ['c']
  ])

  t.deepEqual(motif('[a b]*2 [c d]*3'), [
    ['a'],
    ['b'],
    ['a'],
    ['b'],
    ['c'],
    ['d'],
    ['c'],
    ['d'],
    ['c'],
    ['d']
  ])

  t.deepEqual(motif('[a b]*2, [c d]*2'), [
    ['a', 'c'],
    ['b', 'd'],
    ['a', 'c'],
    ['b', 'd']
  ])

  t.deepEqual(motif('a [b c, d]*3 e'), [
    ['a'],
    ['b', 'd'],
    ['c'],
    ['b', 'd'],
    ['c'],
    ['b', 'd'],
    ['c'],
    ['e']
  ])
})
