const test = require('ava');
const ProductsAPI = require('../lib/datasources/products-api');
const api = new ProductsAPI();
const Redis = require('ioredis');
const client = new Redis();
const TestCommon = require('../lib/common');
const common = new TestCommon();

/*test.before(async (t) => {
  const promises = [];
  //generate 1000 products
  for(let a = 0; a < 1000; a++) {
    promises.push(api.create(client, {
      name: common.getCustomerName(),
      version: common.getRandomSemVer(),
      datePosted: '2019-11-20',
      dateDeleted: '',
      domain: 'stores',
    }));
  }
  const all = await Promise.all(promises);
});

test('ProductsAPI.create(client, obj)', async (t) => {
  const { success, message } = await api.create(client, {
      name: 'my-customer-name',
      version: '23.99.45',
      datePosted: '2019-11-20',
      domain: 'stores','
    });
  t.is(typeof api.create, 'function');
  t.is(success, true);
  t.is(message, 'Successfully created product.');

});


test.after( async t => {
  //return client.flushall();
});*/
