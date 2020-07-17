const uuidV4 = require('uuid/v4');
const PRODUCT = 'product';
const CUSTOMER = 'customer';

const pause = ms => new Promise((resolve) => setTimeout(() => resolve(), ms));
const getId = str => {
  const parts = str.split(':');
  return parts[0];
}
const scan = async (client, cursor, labels, term) => {
  const response = await client.scan(cursor, 'MATCH', term);
  cursor = response[0];
  labels = labels.concat(response[1]);
  if (cursor === '0') {
    return labels;
  }
  return scan(client, cursor, labels, term);
}

module.exports = class DataUtil {
  constructor() {

  }
  static get PRODUCT() { return PRODUCT; }
  static get CUSTOMER() { return CUSTOMER; }

  static async scan(client, cursor, labels, term, count=10) {
    return scan(client, cursor, labels, term, count);
  }

  static createId() { return uuidV4(); }

  static createRedisKey (type, id, group = null, name, version) {
    let key;
    if ( group ) {
      key = `${id}:${group}:${type}:${name}`;
    } else {
      key = `${id}:${type}:${name}`;
    }
    if (version) key = `${key}:${version}`;
    return key;
  }
}
