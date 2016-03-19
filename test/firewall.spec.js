'use strict';

var Firewall = require('../lib/firewall');
var Rule = require('../lib/firewall/rule');

// set up fixtures
var urls = require('./fixtures/urls.json');
var fw1 = new Firewall();
fw1.addRule('^/admin', 'admin', '*');
fw1.addRule('^/orders', ['user','admin'], ['GET','PUT','POST']);
fw1.addRule('^/orders', 'admin', 'DELETE');
fw1.addRule('^/profile', ['user','admin'], ['GET','PUT']);
fw1.addRule('^/signup', 'readonly', 'POST');
fw1.addRule('^/shop', 'readonly', 'GET');

// basepath support
var fw2 = new Firewall(new RegExp('/api/v1'));
fw2.addRule('^/admin', 'admin', '*');
fw2.addRule('^/orders', ['user','admin'], ['GET','PUT','POST']);
fw2.addRule('^/orders', 'admin', 'DELETE');
fw2.addRule('^/profile', ['user','admin'], ['GET','PUT']);
fw2.addRule('^/signup', 'readonly', 'POST');
fw2.addRule('^/shop', 'readonly', 'GET');

var fw3 = new Firewall('/api/v2');
fw3.addRule('^/admin', 'admin', '*');
fw3.addRule('^/orders', ['user','admin'], ['GET','PUT','POST']);
fw3.addRule('^/orders', 'admin', 'DELETE');
fw3.addRule('^/profile', ['user','admin'], ['GET','PUT']);
fw3.addRule('^/signup', 'readonly', 'POST');
fw3.addRule('^/shop', 'readonly', 'GET');

// helpers
function assertAllowedFirewallRule(matchingRule, rule) {
  assert.instanceOf(matchingRule, Rule);
  assert.equal(matchingRule.path, rule.path);
  assert.equal(matchingRule.roles, rule.roles);
  assert.equal(matchingRule.methods, rule.methods);
}

describe('firewall module', function(){

  //beforeEach(function(){
  //});

  //afterEach(function(){
  //});

  describe('new Firewall()', function(){

    it('should be an instance of Firewall', function(){

      assert.instanceOf(fw1, Firewall);

    });

  });

  describe('addRule()', function(){

    it('should contain valid Rules', function(){

      assert.instanceOf(fw1.rules[0], Rule);
      assert.instanceOf(fw1.rules[1], Rule);
      assert.instanceOf(fw1.rules[2], Rule);

    });

  });

  describe('check() allowed', function(){

    // /admin resource

    it('fw1 should allow access "/admin","admin",GET', function(){

      var matchingRule = fw1.check('/admin', "admin", 'GET');
      assertAllowedFirewallRule(matchingRule, fw1.rules[0]);

    });

    it('fw1 should allow access "/admin/users","admin",POST', function(){

      var matchingRule = fw1.check('/admin/users', "admin", 'POST');
      assertAllowedFirewallRule(matchingRule, fw1.rules[0]);

    });

    it('fw1 should allow access "/admin/users/1","admin",GET', function(){

      var matchingRule = fw1.check('/admin/users/1', "admin", 'GET');
      assertAllowedFirewallRule(matchingRule, fw1.rules[0]);

    });

    it('fw1 should allow access "/admin/users/1","admin",PUT', function(){

      var matchingRule = fw1.check('/admin/users/1', "admin", 'PUT');
      assertAllowedFirewallRule(matchingRule, fw1.rules[0]);

    });

    it('fw1 should allow access "/admin/users/1","admin",PATCH', function(){

      var matchingRule = fw1.check('/admin/users/1', "admin", 'PATCH');
      assertAllowedFirewallRule(matchingRule, fw1.rules[0]);

    });

    it('fw1 should allow access "/admin/users/1","admin",DELETE', function(){

      var matchingRule = fw1.check('/admin/users/1', "admin", 'DELETE');
      assertAllowedFirewallRule(matchingRule, fw1.rules[0]);

    });

    // /orders resource

    it('fw1 should allow access "/orders","user",GET', function(){

      var matchingRule = fw1.check('/orders', "admin", 'GET');
      assertAllowedFirewallRule(matchingRule, fw1.rules[1]);

    });

    it('fw1 should allow access "/orders","user",POST', function () {

      var matchingRule = fw1.check('/orders', "admin", 'POST');
      assertAllowedFirewallRule(matchingRule, fw1.rules[1]);

    });

    it('fw1 should allow access "/orders/1","user",PUT', function(){

      var matchingRule = fw1.check('/orders/1', "user", 'PUT');
      assertAllowedFirewallRule(matchingRule, fw1.rules[1]);

    });

    // default routes

    it('fw1 should allow access "/shop",[readonly],GET', function(){

      var matchingRule = fw1.check('/shop', ['readonly'], 'GET');
      assertAllowedFirewallRule(matchingRule, fw1.rules[5]);

    });

    it('fw1 should allow access "/shop?tag=socks",[readonly],GET', function(){

      var matchingRule = fw1.check('/shop?tag=socks', ['readonly'], 'GET');
      assertAllowedFirewallRule(matchingRule, fw1.rules[5]);

    });

    it('fw1 should allow access "/shop/meta",[readonly],GET', function(){

      var matchingRule = fw1.check('/shop/meta', ['readonly'], 'GET');
      assertAllowedFirewallRule(matchingRule, fw1.rules[5]);

    });

    it('fw1 should allow access "/shop/meta?type=peace",[readonly],GET', function(){

      var matchingRule = fw1.check('/shop/meta?type=peace', ['readonly'], 'GET');
      assertAllowedFirewallRule(matchingRule, fw1.rules[5]);

    });

    it('fw1 should allow access "/signup",[readonly],POST', function(){

      var matchingRule = fw1.check('/signup', ['readonly'], 'POST');
      assertAllowedFirewallRule(matchingRule, fw1.rules[4]);

    });


  });

  describe('check() denied', function(){

    it('fw1 should deny access "/",readonly,POST', function(){

      var matchingRule = fw1.check('/', ['readonly','admin'], 'POST');
      assert.isUndefined(matchingRule);

    });

    it('fw1 should deny access "/",readonly,PUT', function(){

      var matchingRule = fw1.check('/', ['readonly','admin'], 'PUT');
      assert.isUndefined(matchingRule);

    });

    it('fw1 should deny access "/",readonly,DELETE', function(){

      var matchingRule = fw1.check('/', ['readonly','admin'], 'DELETE');
      assert.isUndefined(matchingRule);

    });

    it('fw1 should deny access "/",readonly,PATCH', function(){

      var matchingRule = fw1.check('/', ['readonly','admin'], 'PATCH');
      assert.isUndefined(matchingRule);

    });

    it('fw1 should deny access "/signup",readonly,DELETE', function(){

      var matchingRule = fw1.check('/signup', ['readonly'], 'DELETE');
      assert.isUndefined(matchingRule);

    });

    it('fw1 should deny access "/admin",readonly,GET', function(){

      var matchingRule = fw1.check('/admin', ['readonly'], 'GET');
      assert.isUndefined(matchingRule);

    });

  });

  describe('basepath support', function(){

    it('fw2 should allow access "/api/v1/admin",admin,GET', function(){

      var matchingRule = fw2.check('/api/v1/admin', "admin", 'GET');
      assertAllowedFirewallRule(matchingRule, fw2.rules[0]);

    });

    it('fw1 should allow access "/api/v1/signup",[readonly],POST', function(){

      var matchingRule = fw2.check('/api/v1/signup', ['readonly'], 'POST');
      assertAllowedFirewallRule(matchingRule, fw2.rules[4]);

    });

    it('fw2 should deny access "/admin",admin,GET', function(){

      var matchingRule = fw2.check('/admin', 'admin', 'GET');
      assert.isUndefined(matchingRule);

    });

    it('fw1 should allow access "/signup",[readonly],POST', function(){

      var matchingRule = fw2.check('/signup', ['readonly'], 'POST');
      assert.isUndefined(matchingRule);

    });

  });

});