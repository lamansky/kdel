'use strict'

const arrify = require('arrify')
const canDeleteProp = require('can-delete-prop')
const get = require('kget')
const is = require('is-instance-of')
const isObject = require('is-object')
const size = require('vsize')
const xfn = require('xfn')

const notFound = Symbol('notFound')

module.exports = xfn({
  pluralArg: 1,
  pluralProp: 'all',
  pluralReturn: true,
}, function del (obj, keychains, {delete: d = defaultDelete, isEmpty = defaultIsEmpty, recursive, ...options} = {}) {
  return arrify(keychains).map(keychain => {
    const [collections, keychainFound] = getCollections(obj, keychain, options)
    for (const [i, [c, key]] of collections.entries()) {
      if (i > 0 || keychainFound) d(c, key, options, () => defaultDelete(c, key, options))
      if (!recursive || !isEmpty(c, options, () => defaultIsEmpty(c, options))) break
    }
    return keychainFound
  })
})

function getCollections (c, keys, options) {
  const collections = []
  for (const key of arrify(keys)) {
    collections.unshift([c, key])
    c = get(c, [key], {...options, fallback: notFound, inObj: false})
    if (c === notFound) return [collections, false]
  }
  return [collections, true]
}

function defaultIsEmpty (collection, {weakMaps = [], weakSets = [], ...options} = {}) {
  return !is(collection, ['WeakMap', weakMaps, 'WeakSet', weakSets]) && size(collection, options) === 0
}

function defaultDelete (collection, key, options = {}) {
  key = get.key(collection, key, {...options, fallback: key})
  const {arrays = [], maps = [], sets = [], weakMaps = []} = options
  if (is(collection, ['Array', arrays])) {
    if (key >= collection.length) return false
    collection.splice(key, 1)
    return true
  } else if (is(collection, ['Map', maps, 'WeakMap', weakMaps])) {
    return collection.delete(key)
  } else if (is(collection, ['Set', sets])) {
    const values = Array.from(collection.values())
    if (key >= values.length) return false
    values.splice(key, 1)
    collection.clear()
    for (const v of values) collection.add(v)
    return true
  } else if (isObject(collection)) {
    return canDeleteProp(collection, key) ? delete collection[key] : false
  } else {
    throw new TypeError('Cannot delete property of a non-object')
  }
}
