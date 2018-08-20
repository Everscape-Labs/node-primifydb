const got  = require('got');

const HttpAgent = require('agentkeepalive');

const client = new HttpAgent({
  maxSockets: 100,
});

class Primify {
  constructor(url, database) {
    this.url      = url;
    this.database = database;
  }

  write(collection, key, data, splitField) {
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

    const payload = {
      splitField,
      key,
      data,
    };

    const url = `${this.url}/${this.database}/_write/${collection}`;

    // console.log('WRITING', url);

    return got.post(url, {
      agent: {
        http: client,
      },
      json : true,
      body : payload,
    })
      .catch((error) => {
        console.error('GOT ERROR : ', error.stack);
      })
  }

  fetch(collection, key, date) {
    if (!collection) {
      throw new Error('You must specify a collection');
    }

    if (!key) {
      throw new Error('You must specify a key');
    }

    if (!date) {
      throw new Error('You must specify a date');
    }

    let payload = {
      key,
      date,
    };

    if (date && date.dateFrom && date.dateTo) {
      payload = {
        key,
        dateFrom: date.dateFrom,
        dateTo  : date.dateTo,
      };
    }

    const url = `${this.url}/${this.database}/_read/${collection}`;

    console.log(`READING ${url}`, payload);

    return got.post(url, {
      json: true,
      body: payload,
    })
      .then((response) => {
        if (response.body) {
          return Promise.resolve(response.body);
        }

        return Promise.reject(new Error('NO RESPONSE BODY'));
      })
  }

  bulkInsert(collection, data, smart = true) {
    const payload = {
      database: this.database,
      collection,
      data,
      smart,
    };

    const url = `${this.url}/${this.database}/_write/bulk/${collection}`;

    return got.post(url, {
      agent: {
        http: client,
      },
      json : true,
      body : payload,
    })
      .then((response) => {
        console.log('response', response.body);
        return Promise.resolve();
      })
      .catch((error) => {
        console.error('GOT ERROR : ', error.stack);
      })
  }
}

export default Primify;