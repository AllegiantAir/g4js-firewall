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

firewall.addRule('^/admin', 'admin', '*');
firewall.addRule('^/orders', ['user','admin'], ['GET','PUT','POST']);
firewall.addRule('^/orders', 'admin', 'DELETE');
firewall.addRule('^/profile', ['user','admin'], ['GET','PUT']);
firewall.addRule('^/signup', 'readonly', 'POST');
firewall.addRule('^/shop', 'readonly', 'GET');

var url = '/admin';
var roles = ['admin'];
var method = 'GET';

// returns matching rule if match found
var matchingRule = firewall.check(url, roles, method);

// returns undefined if no matching rules found
var noBueno = firewall.check(url, 'hog_rider', method);

// express middleware coming soon...

```

## License

[MIT](LICENSE)

## Contribute

Pull Requests always welcome, as well as any feedback or issues. Made with OSS <3 and #teamgorgeous.