'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var bsv = require('bsv1');
var utils = require('../utils');
var $ = bsv.util.preconditions;
var _ = bsv.deps._;
var BufferReader = bsv.encoding.BufferReader;
var BufferWriter = bsv.encoding.BufferWriter;

/**
 * @param {Array=} arg - An array of addrs
 * @param {Object=} options
 * @extends Message
 * @constructor
 */
function AddrMessage(arg, options) {
  Message.call(this, options);
  this.command = 'addr';
  $.checkArgument(
    _.isUndefined(arg) ||
      (Array.isArray(arg) &&
       !_.isUndefined(arg[0].services) &&
       !_.isUndefined(arg[0].ip) &&
       !_.isUndefined(arg[0].port)),
    'First argument is expected to be an array of addrs'
  );
  this.addresses = arg;
}
inherits(AddrMessage, Message);

AddrMessage.prototype.setPayload = function(payload) {
  var parser = new BufferReader(payload);

  var addrCount = parser.readVarintNum();

  this.addresses = [];
  for (var i = 0; i < addrCount; i++) {
    // todo: time only available on versions >=31402
    var time = new Date(parser.readUInt32LE() * 1000);

    var addr = utils.parseAddr(parser);
    addr.time = time;
    this.addresses.push(addr);
  }

  utils.checkFinished(parser);
};

AddrMessage.prototype.getPayload = function() {
  var bw = new BufferWriter();
  bw.writeVarintNum(this.addresses.length);

  for (var i = 0; i < this.addresses.length; i++) {
    var addr = this.addresses[i];
    bw.writeUInt32LE(addr.time.getTime() / 1000);
    utils.writeAddr(addr, bw);
  }

  return bw.concat();
};

module.exports = AddrMessage;
