# kdel

Uses one or more keys to locate and delete a value in a Map, Object, or other collection. Supports nesting, loose key matching, recursive deletion, and more.

## Installation

Requires [Node.js](https://nodejs.org/) 8.3.0 or above.

```bash
npm i kdel
```

## API

The module exports a `del()` function that has one other function attached to it as a method: `del.all()`.

### `del()`

#### Parameters

1. Bindable: `obj` (Array, Iterator, Map, Object, Set, or Typed Array): The key-value collection with the value to be deleted.
2. `keychain` (any, or array of any): The key at which the value to be deleted is located, or an array of nested keys.
3. Optional: Object argument:
    * `arrays` / `maps` / `sets` / `weakMaps` (arrays of classes/strings): Arrays of classes and/or string names of classes that should be treated as equivalent to `Array`/`Map`/`Set`/`WeakMap` (respectively).
    * `delete` (function): A callback which, if provided, will override the built-in code that removes a key from a collection. Use this if you need to support collections whose custom APIs preclude the use of parameters like `maps`. The callback will be called with four arguments: the collection, the key, the options object, and a callback for the built-in deletion behavior (to which your custom `delete` callback can defer if it determines that it doesn’t need to override the default behavior after all).
    * `elseThrow` (Error or string): An error to be thrown if `keychain` references nested collections that do not exist. A string will be wrapped in an `Error` object automatically.
    * `get` (function): A callback which, if provided, will override the built-in code that fetches a key from a collection. Use this if you need to support custom classes, for example. The callback will be called with five arguments: the collection, the key, the options object, the fallback to return if the key is not found, and a callback for the built-in get behavior (to which your custom `get` callback can defer if it determines that it doesn’t need to override the default behavior after all).
    * `isEmpty` (function): A callback which, if provided, will override the built-in code that checks whether a collection is empty. Use this if you need to support collections whose custom APIs preclude the use of parameters like `maps`. The callback will be called with three arguments: the collection, the options object, and a callback for the built-in behavior (to which your custom `isEmpty` callback can defer if it determines that it doesn’t need to override the default behavior after all).
    * `loose` (boolean): Whether or not to evaluate keys loosely (as defined by `looselyEquals`). Defaults to `false`.
    * `looselyEquals` (function): A callback that accepts two values and returns `true` if they are to be considered equivalent or `false` otherwise. This argument is only used if `loose` is `true`. If omitted, the default behavior will, among other things, consider arrays/objects to be equal if they have the same entries.
    * `preferStrict` (boolean): Only applies if `loose` is `true`. If `true`, then strictly-identical keys will be preferred over loosely-equivalent keys. Otherwise, the first loosely-equivalent key found will be used, even if a strictly-identical one comes later. Defaults to `false`.
    * `recursive` (boolean): Whether or not to delete empty ancestors in `keychain`. Defaults to `false`.

#### Return Value

Returns `true` if the entire `keychain` existed and the deletion was successful; otherwise `false`.

Even if the function returns `false` due to part of the `keychain` not existing, those keys that _did_ exist will have been deleted if `recursive` was set to `true`.

#### Examples

##### Maps

```javascript
const del = require('kdel')

const map = new Map([['key', 'value']])
map.has('key') // true

del(map, 'key') // true
map.has('key') // false

del(map, 'not a key') // false
```

##### Objects

```javascript
const del = require('kdel')

const obj = {key1: {key2a: 'a', key2b: 'b'}}
obj.key1.key2a // 'a'
obj.key1.key2b // 'b'

del(obj, ['key1', 'key2a']) // true
obj.key1.key2a // undefined
obj.key1.key2b // 'b'

del(obj, ['key1', 'key2b'], {recursive: true}) // true
obj.key1 // undefined
```

### `del.all()`

Use this method if you want to delete multiple keys at once.

#### Parameters

The parameters are the same as the main function, except that the second parameter is called `keychains` and accepts an array of `keychain` arguments.

#### Return Value

An array of booleans, one for each keychain. Each boolean indicates whether the corresponding keychain was found and the deletion was successful.

#### Example

```javascript
const del = require('kdel')

const obj = {a: {b1: 1, b2: 2}}
del.all(obj, [['a', 'b1'], 'c']) // [true, false]

obj.a.b1 // undefined
obj.a.b2 // 2
```

## Related

The “k” family of modules works on keyed/indexed collections.

* [khas](https://github.com/lamansky/khas)
* [kget](https://github.com/lamansky/kget)
* [kedit](https://github.com/lamansky/kedit)
* [kset](https://github.com/lamansky/kset)
* [kinc](https://github.com/lamansky/kinc)

The “v” family of modules works on any collection of values.

* [vhas](https://github.com/lamansky/vhas)
* [vget](https://github.com/lamansky/vget)
* [vsize](https://github.com/lamansky/vsize)
* [vadd](https://github.com/lamansky/vadd)
* [vdel](https://github.com/lamansky/vdel)
