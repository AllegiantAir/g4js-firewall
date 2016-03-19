'use strict';

// Module dependencies.
var Rule = require('./rule');

function Firewall(basePath) {

  var rules = [];

  // Basepath may be used for prefixed like "/api/v1".
  // Ending slash should not be included.
  Object.defineProperty(this, 'basePath', {
    enumerable: true,
    get: function() {
      return basePath;
    },
    set: function(value) {
      if (!(value instanceof RegExp)) {
        value = new RegExp(value);
      }
      basePath = value;
      return this;
    }
  });

  // Collection of registered rules that will check against
  Object.defineProperty(this, 'rules', {
    enumerable: true,
    get: function() {
      return rules;
    }
  });

  if (basePath) {
    this.basePath = basePath;
  }

}

// Register a Rule object to an instance or firewall.
Firewall.prototype.addRule = function(pattern, role, method) {
  this.rules.push(new Rule(pattern, role, method));
  return this;
};

// Match a give HTTP url, HTTP method and roles against
// current collection firewall rules.
Firewall.prototype.check = function(pattern, roles, method) {

  if (this.basePath) {
    // If basepath does not match skip checks.
    if (pattern.match(this.basePath)===null) {
      return;
    }
    // Normalize pattern from basepath by removing it from given pattern.
    pattern = pattern.replace(this.basePath, '');
  }

  var matchingRule;

  for (var i=0; i<this.rules.length; i++) {
    var rule = this.rules[i];

    // Check URL pattern, roles and methods
    if (rule.check(pattern, roles, method)) {
      matchingRule = rule;
      break;
    }
  }

  return matchingRule;

};

module.exports = Firewall;