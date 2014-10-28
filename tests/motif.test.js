var motif = require('../motif')
var assert = require('assert')


describe("motif", function() {
  it("should support numbers", function() {
    assert.strictEqual(motif('0'), 0);
    assert.strictEqual(motif('00023'), 23);
    assert.strictEqual(motif('23'), 23);
    assert.strictEqual(motif('+23'), 23);
    assert.strictEqual(motif('23.23'), 23.23);
    assert.strictEqual(motif('-23.23e-23'), -23.23e-23);
  })

  it("should support strings", function() {
    assert.strictEqual(motif('fooBarBaz'), 'fooBarBaz');
    assert.strictEqual(motif('fooB4rB4z'), 'fooB4rB4z');
  })

  it("should support lookup values", function() {
    assert.deepEqual(
        motif('a b', {
          a: 23,
          b: 42
        }),
        [23, 42]);
  })

  it("should support single level patterns", function() {
    assert.deepEqual(motif('a b'), ['a', 'b'])
    assert.deepEqual(motif('a b c'), ['a', 'b', 'c'])
    assert.deepEqual(motif(' a b c '), ['a', 'b', 'c'])
  })

  it("should support groups", function() {
    assert.deepEqual(motif('[]'), [])
    assert.deepEqual(motif('[a b c]'), ['a', 'b', 'c'])
    assert.deepEqual(motif(' [ a b c ] '), ['a', 'b', 'c'])
  })
})
