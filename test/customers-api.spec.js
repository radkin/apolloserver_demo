const test = require('ava');
const moment = require('moment');
const TestCommon = require('../lib/common');
const common = new TestCommon();
const Redis = require('ioredis');
const client = new Redis('redis://localhost:6329');
const CustomersAPI = require('../lib/datasources/customers-api');
const api = new CustomersAPI();
const ProductsAPI = require('../lib/datasources/products-api');
const api2 = new ProductsAPI();
const created = {};
test.before(async t => {
  //generate 1000 products
  for(let a = 0; a < 1000; a++) {
    let y = 2000 + Math.round(Math.random() * 19);
    let m = 1 + Math.round(Math.random() * 11);
    m = m < 10 ? `0${m}` : m;
    let d = 1 + Math.ceil(Math.random() * 30);
    d = d < 10 ? `0${d}` : d;
    let h = Math.ceil(Math.random() * 24);
    let min = Math.ceil(Math.random() * 60);
    let s = Math.ceil(Math.random() * 60);
    let datePosted = `${y}-${m}-${d} ${h}:${min}:${s}`;

    let myObj = {
      name: common.getCustomerName(),
      price: common.getRandomPrice(),
      datePosted,
      domain: 'stores'
    };
    await api2.create(client, myObj);
  }
  const apps = common.getAllCustomers();
  console.log('-------------- apps length -----------------', apps.length);
  for (let n = 0; n < apps.length; n++) {
    let name = apps[n].name;
    if (!await client.sismember('members:all', name)) {
      //prevent duplicates
      await client.sadd('members:all', name);
      let bool = Math.round(Math.random() * 2) % 2 === 0;
      await api.create(client, {
        group: apps[n].group,
        name,
        baselinePrice: common.getRandomPrice()
      });
    }
  }

  const locs = ['NYC', 'SFO', 'LAX'];
  for (let m = 0; m < apps.length; m++) {
    let name = apps[m].name;
    for(let e = 0; e < locs.length; e++) {
      await api.deployToLocation(client, {
        name,
        location: locs[e],
        price: common.getRandomPrice(),
        timestamp: moment().toISOString(),
      });
    }
  }
});

test('populate redis', async t => {
  t.is(true);
});

test.after(t => {
 // client.flushall();
});
