'use strict';

var firewall = require('../lib');

describe('g4js-firewall module', function(){

  describe('exports', function(){

    it('should expose Firewall', function(){

      assert.isFunction(firewall.Firewall);

    });

    it('should expose FirewallRule', function(){

      assert.isFunction(firewall.FirewallRule);

    });

  });

});