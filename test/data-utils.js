const test = require('ava');
const DataUtil = require('../lib/datasources/data-util');

test("DataUtil", async t => {
  t.is(typeof DataUtil.scan, "function");
});
