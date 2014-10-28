var motif = require('../motif')
var assert = require('assert')


describe("motif", function() {
  it("should support numbers", function() {
    assert.deepEqual(motif('0'), [0]);
    assert.deepEqual(motif('00023'), [23]);
    assert.deepEqual(motif('23'), [23]);
    assert.deepEqual(motif('+23'), [23]);
    assert.deepEqual(motif('23.23'), [23.23]);
    assert.deepEqual(motif('-23.23e-23'), [-23.23e-23]);
  })

  it("should support strings", function() {
    assert.deepEqual(motif('fooBarBaz'), ['fooBarBaz']);
    assert.deepEqual(motif('fooB4rB4z'), ['fooB4rB4z']);
  })

  it("should support lookup values", function() {
    assert.deepEqual(
        motif('a b', {
          a: 23,
          b: 42,
        }),
        [23, 42]);
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
  })

  it("should support layers", function() {
    assert.deepEqual(motif('a, b'), [['a'], ['b']])
    assert.deepEqual(motif('a, b, c'), [['a'], ['b'], ['c']])
    assert.deepEqual(motif('a b, c'), [['a', 'b'], ['c']])
    assert.deepEqual(motif('a,b,c'), [['a'], ['b'], ['c']])
    assert.deepEqual(motif('  a  ,  b  ,  c  '), [['a'], ['b'], ['c']])

    assert.deepEqual(
        motif('[a  b], [[[c  d], e], f], g'),
        [['a', 'b'], [[['c', 'd'], ['e']], ['f']], ['g']])
  })
})
