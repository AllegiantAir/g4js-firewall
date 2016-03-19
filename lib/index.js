// g4js-firewall
// --------------

// Simple pattern based firewall that supports roles and HTTP methods.

// - [firewall/index.js](firewall/index.html)
// - [firewall/rule.js](firewall/rule.html)

'use strict';

// Export modules.
var firewall = exports;

firewall.Firewall = require('./firewall');
firewall.FirewallRule = require('./firewall/rule');