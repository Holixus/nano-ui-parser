[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

# nano-ui-parser

[![Join the chat at https://gitter.im/Holixus/nano-ui-parser](https://badges.gitter.im/Holixus/nano-ui-parser.svg)](https://gitter.im/Holixus/nano-ui-parser?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Very simple UI descriptions texts parser

## Usage

```js
	var ui_parser = require('nano-ui-parser');

	var tree = ui_parser(text);

	console.log(tree.toString());
```

## function parse_tree(text)

Returns `Directive` class tree

## class: Directive

* id {String}
* args {String}
* children {Array} of the same class children objects. When object hasn't children its filled with `undefined` value.

## tree.getPath()

Returns array of nodes ids from top-root node to this.

## tree.enumChildren(callback)

* function callback(node, id, args)
  * node {Directive}
  * id {String} node id
  * args {String} node arguments

## About UI files

```
# comment
root arguments
// comment
  sub-element-1 ererw -> werwer
    sub-sub-element-1 there is any text can be arguments
    sus-sub-element-2
-- comment
  sub-element-2
    sub-sub-element-1
```

[bithound-image]: https://www.bithound.io/github/Holixus/nano-ui-parser/badges/score.svg
[bithound-url]: https://www.bithound.io/github/Holixus/nano-ui-parser

[gitter-image]: https://badges.gitter.im/Holixus/nano-ui-parser.svg
[gitter-url]: https://gitter.im/Holixus/nano-ui-parser

[npm-image]: https://badge.fury.io/js/nano-ui-parser.svg
[npm-url]: https://badge.fury.io/js/nano-ui-parser

[github-tag]: http://img.shields.io/github/tag/Holixus/nano-ui-parser.svg
[github-url]: https://github.com/Holixus/nano-ui-parser/tags

[travis-image]: https://travis-ci.org/Holixus/nano-ui-parser.svg?branch=master
[travis-url]: https://travis-ci.org/Holixus/nano-ui-parser

[coveralls-image]: https://coveralls.io/repos/github/Holixus/nano-ui-parser/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/Holixus/nano-ui-parser?branch=master

[david-image]: https://david-dm.org/Holixus/nano-ui-parser.svg
[david-url]: https://david-dm.org/Holixus/nano-ui-parser

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE

[downloads-image]: http://img.shields.io/npm/dt/nano-ui-parser.svg
[downloads-url]: https://npmjs.org/package/nano-ui-parser
