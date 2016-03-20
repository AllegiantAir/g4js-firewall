# g4js-firewall [![Build Status](https://secure.travis-ci.org/AllegiantAir/g4js-firewall.png)](http://travis-ci.org/AllegiantAir/g4js-firewall) [![Code Climate](https://codeclimate.com/github/AllegiantAir/g4js-firewall/badges/gpa.svg)](https://codeclimate.com/github/AllegiantAir/g4js-firewall) [![Test Coverage](https://codeclimate.com/github/AllegiantAir/g4js-firewall/badges/coverage.svg)](https://codeclimate.com/github/AllegiantAir/g4js-firewall/coverage)

Simple pattern based firewall that supports roles and HTTP methods.

## Install

```sh
$ npm install g4js-firewall
```

## Usage

Require the module:

```js
var Firewall = require('g4js-firewall').Firewall;
```

Add some rules:
```js
var firewall = new Firewall();

// admin path restricted to admin role with all methods allowed
firewall.addRule('^/admin', 'admin', '*');

// admin path restricted to admin role with all methods allowed
firewall.addRule('^/orders', ['user','admin'], ['GET','PUT','POST']);

// signup path restricted to readonly role using POST method
firewall.addRule('^/signup', 'readonly', 'POST');

// shop path restricted to readonly role using GET method
firewall.addRule('^/shop', 'readonly', 'GET');
```

Run some checks:
```js
// returns matching rule if match found
var matchingRule = firewall.check('/admin', ['admin'], 'GET');

// returns undefined if no matching rules found
var noBueno = firewall.check('/admin', 'hog_rider', 'GET');

// express middleware coming soon...

```

## License

[MIT](LICENSE)

## Contribute

Pull Requests always welcome, as well as any feedback or issues. Made with OSS <3 and brought to you by #teamgorgeous.