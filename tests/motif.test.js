var motif = require('../motif')
var assert = require('assert')


describe("motif", function() {
  it("should support numbers", function() {
    assert.strictEqual(motif('0'), 0);
    assert.strictEqual(motif('2'), 2);
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
    assert.strictEqual(
        motif('a', {
          a: 23,
          b: 42
        }),
        23);
  })
})
