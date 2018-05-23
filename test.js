'use strict'

const assert = require('assert')
const del = require('.')
const isArrayWith = require('is-array-with')

describe('del()', function () {
  it('should delete a key from a Map', function () {
    const map = new Map()
    map.set('key1', 'value1')
    map.set('key2', 'value2')
    assert(map.has('key1'))
    assert(map.has('key2'))
    del(map, 'key1')
    assert(!map.has('key1'))
    assert(map.has('key2'))
  })

  it('should return true if Map key exists', function () {
    assert.strictEqual(del(new Map([['key', 'value']]), 'key'), true)
  })

  it('should return false if Map key does not exist', function () {
    assert.strictEqual(del(new Map(), 'key'), false)
  })

  it('should delete a key from an Object', function () {
    const obj = {key1: 'value1', key2: 'value2'}
    assert(obj.hasOwnProperty('key1'))
    del(obj, 'key1')
    assert(!obj.hasOwnProperty('key1'))
    assert(obj.hasOwnProperty('key2'))
  })

  it('should return true if Object key exists', function () {
    assert.strictEqual(del({key: 'value'}, 'key'), true)
  })

  it('should return false if Object key does not exist', function () {
    assert.strictEqual(del({}, 'key'), false)
  })

  it('should delete an index from an Array', function () {
    const arr = ['a', 'b']
    del(arr, 0)
    assert(isArrayWith(arr, 'b'))
    del(arr, 0)
    assert(isArrayWith(arr))
  })

  it('should return true if Array index exists', function () {
    assert.strictEqual(del([''], 0), true)
  })

  it('should return false if Array index does not exist', function () {
    assert.strictEqual(del([], 0), false)
  })

  it('should delete a Set element by index', function () {
    const set = new Set(['a', 'b'])
    assert.strictEqual(set.size, 2)
    assert(set.has('a'))
    assert(set.has('b'))
    del(set, 0)
    assert.strictEqual(set.size, 1)
    assert(!set.has('a'))
    assert(set.has('b'))
    del(set, 0)
    assert.strictEqual(set.size, 0)
    assert(!set.has('a'))
    assert(!set.has('b'))
  })

  it('should return true if Set index exists', function () {
    assert.strictEqual(del(new Set(['']), 0), true)
  })

  it('should return false if Set index does not exist', function () {
    assert.strictEqual(del(new Set(), 0), false)
  })

  it('should delete a value referenced by nested key chain', function () {
    const map = new Map()
    map.set('map', {obj: ['value']})
    assert(isArrayWith(map.get('map').obj, 'value'))
    del(map, ['map', 'obj', 0])
    assert(isArrayWith(map.get('map').obj))
  })

  it('should delete empty parent collections if `recursive` is true', function () {
    const map = new Map()
    map.set('map', {obj1: {obj: ['value']}, obj2: 'stay'})
    assert(isArrayWith(map.get('map').obj1.obj, 'value'))
    del(map, ['map', 'obj1', 'obj', 0], {recursive: true})
    assert(!map.get('map').hasOwnProperty('obj1'))
    assert.strictEqual(map.get('map').obj2, 'stay')
  })

  it('should delete equivalent key if `loose` is true', function () {
    const key1 = {key: true}
    const map = new Map()
    map.set(key1, 'value')
    assert(!del(map, {key: true}))
    assert.strictEqual(map.size, 1)
    assert(map.has(key1))
    assert(del(map, {key: true}, {loose: true}))
    assert.strictEqual(map.size, 0)
    assert(!map.has(key1))

    map.set(key1, {sub: 1})
    assert(del(map, [{key: true}, 'sub'], {loose: true}))
    assert.strictEqual(typeof map.get(key1), 'object')
    assert.strictEqual(Object.keys(map.get(key1)).length, 0)
    assert(!del(map, [{key: true}, 'sub'], {loose: true, recursive: true}))
    assert(!map.has(key1))
  })

  it('should throw a TypeError if given a non-object', function () {
    assert.throws(() => { del('not an object', 0) }, TypeError)
  })
})
