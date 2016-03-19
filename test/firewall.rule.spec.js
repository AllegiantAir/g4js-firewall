'use strict';

var Rule = require('../lib/firewall/rule');

// set up fixtures
var urls = require('./fixtures/urls.json');

describe('rule module', function(){

  beforeEach(function(){

    this.rule1 = new Rule('^/', 'user', ['GET', 'POST', 'PUT']);
    this.rule2 = new Rule('^/admin', 'admin', '*');
    this.rule3 = new Rule(new RegExp('^/'), 'readonly', ['GET']);

  });

  //afterEach(function(){
  //});
  describe('new Rule()', function(){

    var rule = new Rule();

    it('should be an instance of Rule', function(){

      assert.instanceOf(this.rule1, Rule, 'rule1 is an instance of Rule');
      assert.instanceOf(this.rule2, Rule, 'rule2 is an instance of Rule');
      assert.instanceOf(this.rule3, Rule, 'rule3 is an instance of Rule');

    });

    it('should have a path property (RegExp)', function(){

      assert.instanceOf(this.rule1.pattern, RegExp);
      assert.instanceOf(this.rule2.pattern, RegExp);
      assert.instanceOf(this.rule3.pattern, RegExp);
      assert.isUndefined(rule.pattern);

    });

    it('should have a roles property (Array)', function(){

      assert.instanceOf(this.rule1.roles, Array);
      assert.instanceOf(this.rule2.roles, Array);
      assert.instanceOf(this.rule3.roles, Array);
      assert.isUndefined(rule.roles);

    });

    it('should have a methods property (Array)', function(){

      assert.instanceOf(this.rule1.methods, Array);
      assert.instanceOf(this.rule2.methods, Array);
      assert.instanceOf(this.rule3.methods, Array);
      assert.isUndefined(rule.methods);

    });

  });

  describe('toString()', function() {

    it('should be print friendly representation of the Rule', function(){

      assert.equal(this.rule1.toString(), JSON.stringify({
        pattern: this.rule1.pattern.toString(),
        roles: this.rule1.roles,
        methods: this.rule1.methods
      }));

    });

  });

  describe('urlMatch()', function(){

    it('should have only valid matches for rule1', function(){

      for (var prop in urls) {
        assert.isTrue(this.rule1.urlMatch(urls[prop].url));
      }

    });

    it('should have valid and invalid matches for rule2', function(){

      assert.isTrue(this.rule2.urlMatch(urls.ADMIN.url));
      assert.isTrue(this.rule2.urlMatch(urls.ADMIN_SETTINGS.url));
      assert.isTrue(this.rule2.urlMatch(urls.ADMIN_USERS_1.url));

      assert.isFalse(this.rule2.urlMatch(urls.ROOT.url));
      assert.isFalse(this.rule2.urlMatch(urls.ORDERS.url));
      assert.isFalse(this.rule2.urlMatch(urls.FOOBAR.url));
      assert.isFalse(this.rule2.urlMatch(urls.USER_12345.url));

    });

    it('should have valid and invalid matches for rule3', function(){

      for (var prop in urls) {
        assert.isTrue(this.rule3.urlMatch(urls[prop].url));
      }

    });

  });

  describe('methodMatch()', function(){

    it('should have valid and invalid matches for rule1', function(){

      assert.isTrue(this.rule1.methodMatch('GET'));
      assert.isTrue(this.rule1.methodMatch('get'));
      assert.isTrue(this.rule1.methodMatch('POST'));
      assert.isTrue(this.rule1.methodMatch('PUT'));
      assert.isFalse(this.rule1.methodMatch('DELETE'));
      assert.isFalse(this.rule1.methodMatch('PATCH'));
      assert.isFalse(this.rule1.methodMatch('HEAD'));

    });

    it('should have only valid matches for rule2', function(){

      assert.isTrue(this.rule2.methodMatch('GET'));
      assert.isTrue(this.rule2.methodMatch('get'));
      assert.isTrue(this.rule2.methodMatch('POST'));
      assert.isTrue(this.rule2.methodMatch('PUT'));
      assert.isTrue(this.rule2.methodMatch('DELETE'));
      assert.isTrue(this.rule2.methodMatch('PATCH'));
      assert.isTrue(this.rule2.methodMatch('HEAD'));

    });

    it('should have valid and invalid matches for rule3', function(){

      assert.isTrue(this.rule3.methodMatch('GET'));
      assert.isTrue(this.rule3.methodMatch('get'));
      assert.isFalse(this.rule3.methodMatch('POST'));
      assert.isFalse(this.rule3.methodMatch('PUT'));
      assert.isFalse(this.rule3.methodMatch('DELETE'));
      assert.isFalse(this.rule3.methodMatch('PATCH'));
      assert.isFalse(this.rule3.methodMatch('HEAD'));

    });

    it('should thow an ERROR for invalid HTTP methods', function(){

      var rule = this.rule3;
      assert.throws(function(){
        rule.methodMatch('HOG_RIDERS!');
      }, 'Method Not Allowed (HOG_RIDERS!)');

    });

    it('should support case insensitivity', function(){

      assert.isTrue(this.rule1.methodMatch('POST'));
      assert.isTrue(this.rule1.methodMatch('post'));
      assert.isTrue(this.rule2.methodMatch('HEAD'));
      assert.isTrue(this.rule2.methodMatch('head'));
      assert.isTrue(this.rule3.methodMatch('GET'));
      assert.isTrue(this.rule3.methodMatch('get'));

    });

  });

  describe('rolesMatch()', function(){

    it('should have valid and invalid matches for rule1', function(){

      assert.isFalse(this.rule1.rolesMatch('admin'));
      assert.isTrue(this.rule1.rolesMatch('user'));
      assert.isFalse(this.rule1.rolesMatch('readonly'));
      assert.isTrue(this.rule1.rolesMatch(['admin','user']));

    });

    it('should support case insensitivity', function(){

      assert.isTrue(this.rule1.rolesMatch('user'));
      assert.isTrue(this.rule1.rolesMatch('USER'));

    });

  });

  describe('check()', function(){

    it('should only match url ', function(){

      assert.isFalse(this.rule1.check('/', 'readonly', 'DELETE'));
      assert.isFalse(this.rule1.check('/', 'user', 'DELETE'));
      assert.isFalse(this.rule2.check('/admin', 'foo', 'GET'));
      assert.isFalse(this.rule3.check('/', 'readonly', 'POST'));

    });

    it('should only match url and method', function(){

      assert.isFalse(this.rule1.check('/', 'readonly', 'POST'));
      assert.isFalse(this.rule2.check('/admin', 'foo', 'POST'));
      assert.isFalse(this.rule3.check('/', 'foo', 'GET'));

    });

    it('should match fully', function(){

      assert.isTrue(this.rule1.check('/', 'user', 'GET'));
      assert.isTrue(this.rule1.check('/', 'user', 'POST'));
      assert.isTrue(this.rule1.check('/', 'user', 'PUT'));
      assert.isTrue(this.rule1.check('/orders', ['admin', 'user'], 'POST'));

      assert.isTrue(this.rule2.check('/admin', 'admin', 'GET'));
      assert.isTrue(this.rule2.check('/admin', 'admin', 'POST'));
      assert.isTrue(this.rule2.check('/admin', 'admin', 'PUT'));
      assert.isTrue(this.rule2.check('/admin', ['admin', 'user'], 'DELETE'));
      assert.isTrue(this.rule2.check('/admin', 'admin', 'PATCH'));
      assert.isTrue(this.rule2.check('/admin/users', ['admin', 'user'], 'GET'));
      assert.isTrue(this.rule2.check('/admin/users', 'admin', 'POST'));
      assert.isTrue(this.rule2.check('/admin/users/1', 'admin', 'PUT'));
      assert.isTrue(this.rule2.check('/admin/users/1', 'admin', 'DELETE'));
      assert.isTrue(this.rule2.check('/admin/users/1', 'admin', 'PATCH'));

      assert.isTrue(this.rule3.check('/', 'readonly', 'GET'));
      assert.isTrue(this.rule3.check('/orders', 'readonly', 'GET'));
      assert.isTrue(this.rule3.check('/orders/1', 'readonly', 'GET'));
      assert.isTrue(this.rule3.check('/orders/search?filter=1234', 'readonly', 'GET'));

    });

    it('should support wildcard for both roles and methods', function(){
      var rule = new Rule('^/', '*', '*');

      assert.isTrue(rule.check('/', 'user', 'GET'));
      assert.isTrue(rule.check('/', 'user', 'POST'));
      assert.isTrue(rule.check('/', 'user', 'PUT'));
      assert.isTrue(rule.check('/', 'user', 'DELETE'));

      assert.isTrue(rule.check('/users', 'user', 'GET'));
      assert.isTrue(rule.check('/users', 'user', 'POST'));
      assert.isTrue(rule.check('/users/1', 'user', 'PUT'));
      assert.isTrue(rule.check('/users/1', 'user', 'DELETE'));

    });

  });

});