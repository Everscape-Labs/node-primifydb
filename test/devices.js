import Primify from '../src/Primify';
import {forEachLimit} from 'async';
import moment from 'moment';

const chance = require('chance')();

let uuids = [];
const P   = new Primify('http://localhost:3000', 'neerby');

let total = 0;

const generateUUid = () => {
  for (let i = 0; i < 100; i++) {
    uuids.push(chance.guid())
  }
};

const getDateChunks = (dateStart, dateEnd, chunkSize, chunkUnit) => {
  if (dateEnd < dateStart) {
    throw new Error('dateEnd < dateStart');
  }

  const chunks = [];
  for (let i = dateStart; i <= dateEnd; i = moment(i).add(chunkSize, chunkUnit).toDate()) {
    let finalDateEnd = moment(i).add(chunkSize, chunkUnit).subtract(1, 'second').toDate();
    if (finalDateEnd > dateEnd) {
      finalDateEnd = dateEnd;
    }

    chunks.push({
      dateStart: i,
      dateEnd  : finalDateEnd,
    });
  }

  return chunks;
};


// Wrapper for async.eachLimit, but with Promises

const promiseResponseCallback = (resolve, reject) => {
  return (error, optionalResults) => {
    if (error) {
      return reject(error);
    }

    return resolve(optionalResults);
  };
};

const asyncForEachLimit = (array, parallelLimit, iteratorPromised) => new Promise((resolve, reject) => {
  forEachLimit(array, parallelLimit, (item, cb) => {
    iteratorPromised(item)
      .then(() => cb())
      .catch(cb);
  }, promiseResponseCallback(resolve, reject));
});


const arrayOf = (number) => {
  const array = [];
  for (let i = 0; i < number; i++) {
    array.push(i);
  }

  return array;
};


const buildData = async () => {
  const now = new Date();

  const dateChunks = getDateChunks(new Date('2018-07-01'), new Date(), 1, 'day');

  return asyncForEachLimit(dateChunks, 10, async (date) => {
    const arrayOf1000 = arrayOf(10000);

    return asyncForEachLimit(arrayOf1000, 500, async (number) => {
      const deviceUid = chance.pick(uuids);
      const payload   = {
        deviceUid,
        name    : chance.name(),
        age     : chance.age(),
        address : chance.address(),
        location: {
          lat: chance.latitude(),
          lon: chance.longitude(),
        },
        date    : date.dateStart,
      };

      await P.write('atr', deviceUid, payload, 'date');
      total += 1;

      if (total % 100 === 0) {
        console.log(`------------- INSERTED : ${total} / 470000`);
      }

      return Promise.resolve();
    });
  })
};

const readData = async () => {
  uuids.forEach(async uuid => {
    console.log(`UUID ${uuid}`);

    console.log(`each date `);
    const now = new Date();

    for (let date = new Date('2018-07-01'); date <= now; date.setDate(date.getDate() + 1)) {
      const response = await P.fetch('atr', uuid, date);
      console.log('data', response.data);
    }

    console.log(`all dates `);
    const data = await P.fetch('atr', uuid, {
      dateFrom: new Date('2018-07-01'),
      dateTo  : new Date('2018-08-16'),
    });

    if (data && data.data && data.data.body) {
      console.log(`data `, data.data.body);
    } else {
      console.log('DATA MISSING');
    }
  })
};

const main = async () => {
  generateUUid();
  await buildData();

  console.log('DATA BUILT !', total);

  // const content = await readData();
};

main();
