# g4js-firewall [![Build Status](https://secure.travis-ci.org/AllegiantAir/g4js-firewall.png)](http://travis-ci.org/AllegiantAir/g4js-firewall) [![Code Climate](https://codeclimate.com/github/AllegiantAir/g4js-firewall/badges/gpa.svg)](https://codeclimate.com/github/AllegiantAir/g4js-firewall)

Simple pattern based firewall that supports roles and HTTP methods.

## Install

```sh
$ npm install g4js-firewall
```

## Usage

Require the module:

```js
var firewall = require('g4js-firewall').Firewall;

fw1.addRule('^/admin', 'admin', '*');
fw1.addRule('^/orders', ['user','admin'], ['GET','PUT','POST']);
fw1.addRule('^/orders', 'admin', 'DELETE');
fw1.addRule('^/profile', ['user','admin'], ['GET','PUT']);
fw1.addRule('^/signup', 'readonly', 'POST');
fw1.addRule('^/shop', 'readonly', 'GET');

var url = '/admin';
var roles = ['admin'];
var method = 'GET';

// returns matching rule if match found
var matchingRule = fw1.check(url, roles, method);

// returns undefined if no matching rules found
var noBueno = fw1.check(url, 'hog_rider', method);

// express middleware coming soon...

```

## License

[MIT](LICENSE)

## Contribute

Pull Requests always welcome, as well as any feedback or issues. Made with OSS <3 and #teamgorgeous.