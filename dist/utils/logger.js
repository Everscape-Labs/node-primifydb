'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLogger = undefined;

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registerLogger = exports.registerLogger = function registerLogger() {
  var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'debug';

  // Config of logger system :
  _winston2.default.remove(_winston2.default.transports.Console);
  _winston2.default.add(_winston2.default.transports.Console, {
    level: process.env.WINSTON || level || 'debug',
    prettyPrint: true,
    colorize: true,
    timestamp: true
  });
};

exports.default = _winston2.default;