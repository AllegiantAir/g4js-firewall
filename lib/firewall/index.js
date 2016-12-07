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

    // Check the rules against URL pattern and methods
    // Once a match is found, see if the role is allowed
    // If the role is not allowed, break and immediately return
    if (rule.urlMatch(pattern) && rule.methodMatch(method)) {
      if(rule.rolesMatch(roles)){
        matchingRule = rule;
        break;
      } else {
        return;
      }
    }
  }

  return matchingRule;

};

module.exports = Firewall;