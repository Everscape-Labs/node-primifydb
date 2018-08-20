'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var got = require('got');

var HttpAgent = require('agentkeepalive');

var client = new HttpAgent({
  maxSockets: 100
});

var Primify = function () {
  function Primify(url, database) {
    _classCallCheck(this, Primify);

    this.url = url;
    this.database = database;
  }

  _createClass(Primify, [{
    key: 'write',
    value: function write(collection, key, data, splitField) {
      if (!collection) {
        throw new Error('You must specify a collection');
      }

      if (!key) {
        throw new Error('You must specify a key');
      }

      if (!data) {
        throw new Error('You must specify a data');
      }

      if (!splitField) {
        throw new Error('You must specify a splitField value');
      }

      if (!data[splitField]) {
        throw new Error('SplitField is not valid');
      }

      var payload = {
        splitField: splitField,
        key: key,
        data: data
      };

      var url = this.url + '/' + this.database + '/_write/' + collection;

      // console.log('WRITING', url);

      return got.post(url, {
        agent: {
          http: client
        },
        json: true,
        body: payload
      }).catch(function (error) {
        console.error('GOT ERROR : ', error.stack);
      });
    }
  }, {
    key: 'fetch',
    value: function fetch(collection, key, date) {
      if (!collection) {
        throw new Error('You must specify a collection');
      }

      if (!key) {
        throw new Error('You must specify a key');
      }

      if (!date) {
        throw new Error('You must specify a date');
      }

      var payload = {
        key: key,
        date: date
      };

      if (date && date.dateFrom && date.dateTo) {
        payload = {
          key: key,
          dateFrom: date.dateFrom,
          dateTo: date.dateTo
        };
      }

      var url = this.url + '/' + this.database + '/_read/' + collection;

      console.log('READING ' + url, payload);

      return got.post(url, {
        json: true,
        body: payload
      }).then(function (response) {
        if (response.body) {
          return Promise.resolve(response.body);
        }

        return Promise.reject(new Error('NO RESPONSE BODY'));
      });
    }
  }, {
    key: 'bulkInsert',
    value: function bulkInsert(collection, data) {
      var smart = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var payload = {
        database: this.database,
        collection: collection,
        data: data,
        smart: smart
      };

      var url = this.url + '/' + this.database + '/_write/bulk/' + collection;

      return got.post(url, {
        agent: {
          http: client
        },
        json: true,
        body: payload
      }).then(function (response) {
        console.log('response', response.body);
        return Promise.resolve();
      }).catch(function (error) {
        console.error('GOT ERROR : ', error.stack);
      });
    }
  }]);

  return Primify;
}();

exports.default = Primify;