'use strict';

var _ = require('lodash');

// Supported methods:
var GET = 'GET';
var POST = 'POST';
var PUT = 'PUT';
var DELETE = 'DELETE';
var PATCH = 'PATCH';
var HEAD = 'HEAD';
var VALID_METHODS = [GET, POST, PUT, DELETE, PATCH, HEAD];

// Force array type and uppercase values.
function normalizeArray(val) {
  if (!(val instanceof Array)) {
    val = [val];
  }
  return _.invokeMap(val, 'toUpperCase');
}

// Firewall rule object used to model pattern, roles, methods
// and facilitate rules specific routines.
function Rule(pattern, roles, methods) {

  // Regex representation of pattern.
  Object.defineProperty(this, 'pattern', {
    enumerable: true,
    get: function() {
      return pattern;
    },
    set: function(value) {
      if (!(value instanceof RegExp)) {
        value = new RegExp(value);
      }
      pattern = value;
      return this;
    }
  });

  // Collection of allowed roles (AD groups,etc) for
  // the current path.
  Object.defineProperty(this, 'roles', {
    enumerable: true,
    get: function() {
      return roles;
    },
    set: function(value) {
      roles = normalizeArray(value);
      return this;
    }
  });

  // Collection of allowed HTTP methods for the current path.
  Object.defineProperty(this, 'methods', {
    enumerable: true,
    get: function() {
      return methods;
    },
    set: function(value) {
      // shorthand for all methods
      if ('*' === value) {
        value = VALID_METHODS;
      }
      methods = normalizeArray(value);
      return this;
    }
  });

  if (pattern) {
    this.pattern = pattern;
  }

  if (roles) {
    this.roles = roles;
  }

  if (methods) {
    this.methods = methods;
  }

}

// To string helper.
Rule.prototype.toString = function() {
  return JSON.stringify({
    pattern: this.pattern.toString(),
    roles: this.roles,
    methods: this.methods
  });
};

// Check if path has any matches against a URL string.
Rule.prototype.urlMatch = function(url) {

  return url.match(this.pattern) !== null;

};

// Check if methods has a match.
Rule.prototype.methodMatch = function(method) {

  method = method.toUpperCase();

  if (_.indexOf(VALID_METHODS, method) === -1) {
    throw Error('Method Not Allowed (' + method + ')', 405);
  }

  return _.indexOf(this.methods, method) > -1;

};

// Check if methods has a match.
Rule.prototype.rolesMatch = function(roles) {

  // Support wildcard for roles. Questioning this feature???
  if ('*' === this.roles[0]) {
    return true;
  }

  return _.intersection(this.roles, normalizeArray(roles)).length > 0;

};

// Check if path has any matches against a pattern (URL string),
// HTTP method and roles.
Rule.prototype.check = function(pattern, roles, method) {

  return this.urlMatch(pattern) && this.methodMatch(method) && this.rolesMatch(roles);

};

module.exports = Rule;