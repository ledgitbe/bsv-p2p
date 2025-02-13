'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var bsv = require('bsv1');
var Buffer = require('buffer').Buffer;

/**
 * Request information about active peers
 * @extends Message
 * @param {Object} options
 * @constructor
 */
function GetaddrMessage(arg, options) {
  Message.call(this, options);
  this.command = 'getaddr';
}
inherits(GetaddrMessage, Message);

GetaddrMessage.prototype.setPayload = function() {};

GetaddrMessage.prototype.getPayload = function() {
  return Buffer.alloc(1);
};

module.exports = GetaddrMessage;
