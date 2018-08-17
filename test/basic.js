import Primify from '../src/Primify';

const chance = require('chance')();

let uuids = [chance.guid()];
const P   = new Primify('http://localhost:3000', 'neerby');

const buildData = async () => {
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
    date    : new Date(),
  };

  return P.write('atr', deviceUid, payload, 'date');
};

const readData = async () => {
  const deviceUid = chance.pick(uuids);
  const date      = new Date();

  return P.fetch('atr', deviceUid, date);
};

const main = async () => {
  return buildData()
    .then(() => readData())
    .then((content) => console.log(content))
    .catch(error => {
      console.log('error.stack', error.stack);
    })
};

main();


