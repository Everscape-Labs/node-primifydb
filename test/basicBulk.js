import Primify from '../src/Primify';
import moment from "moment/moment";

const chance = require('chance')();

let uuids = [];
let dates = [];
const P   = new Primify('http://localhost:3000', 'neerby');

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

    chunks.push(dateStart);
  }

  return chunks;
};

const generateDates = () => {
  dates = getDateChunks(new Date('2018-07-01'), new Date(), 1, 'day');

  return dates;
}


const generateData = (limit) => {
  const data = [];

  for (let i =0; i < limit; i++) {
    const deviceUid = chance.pick(uuids);
    const date = chance.pick(dates);
    const payload   = {
      deviceUid,
      date,
      name    : chance.name(),
      age     : chance.age(),
      address : chance.address(),
      location: {
        lat: chance.latitude(),
        lon: chance.longitude(),
      },
    };

    data.push({
      key: deviceUid,
      date,
      data: payload,
    });
  }

  return data;
};


const buildData = async () => {
  generateUUid();
  generateDates();
  const data0 = generateData(2);
  const data = generateData(1000);
  const data2 = generateData(10000);

  console.log('INSERT 2 ATRs SIMPLE - smart = false');
  await P.bulkInsert('atr', data0, false);

  console.log('INSERT 1000 ATRs SIMPLE - smart = true');
  await P.bulkInsert('atr', data, true);

  console.log('INSERT 1000 ATRs SIMPLE - smart = true');
  await P.bulkInsert('atr', data, false);


  console.log('INSERT 10000 ATRs SIMPLE - smart = true');
  await P.bulkInsert('atr', data2, true);

  console.log('INSERT 10000 ATRs SIMPLE - smart = false');
  await P.bulkInsert('atr', data2, false);
}

const main = async () => {
  return buildData()
    .catch(error => {
      console.log('error.stack', error.stack);
    })
};

main();


