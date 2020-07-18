const {RESTDataSource} = require('apollo-datasource-rest');
const { scan } = require('./common');
const DataUtil = require('./data-util');
module.exports = class CustomersApi extends RESTDataSource {
  // should constructor properties match schema?
  constructor() {
    super();
    this.name = '';
    this.gitlabSourceRepoUrl = '';
  }

  async create (client, {
    group,
    name,
    baselinePrice
  }) {
    const id = DataUtil.createId();
    const key = DataUtil.createRedisKey(DataUtil.CUSTOMER, id, group, name);
    const success = await client.hmset(key,
      'id', id,
      'group', group,
      'name', name,
      'locations','',
      'baselinePrice', baselinePrice
    );
    // index all customers in set, ignore if previously created
    let isMember = await client.sismember('customers:set:all', name);
    if (!isMember) {
      // if not in set let's add
      await client.sadd('customers:set:all', name);
      await client.rpush('customers:list:all', key);
      await client.sort('customers:list:all', 'ALPHA', 'STORE', 'customers:list:all');
    }

    return {
      success: success === 'OK',
      message: `successfully created ${key}`
    }
  }
  async deployToLocation(client, { name, location, price, timestamp }) {
   const success = await client.hmset(`locations:${name}`,
    location, JSON.stringify( { price, timestamp })
   );
   return {
     success: success === 'OK',
     message: `successfully deployed ${name} to ${location}`
   }
  }

  async updatebaselinePrice(client, { name, price }) {
    const pattern = `*:customer:${name}`;
    const keys = await DataUtil.scan(client, 0, [], pattern);
    const key = keys[0];
    const success = await client.hset(key, 'baselinePrice', price);
   return {
     success: success === 'OK',
     message: `successfully updated baselinePrice of ${name} to ${price}`
   }
  }

  async get(client, name, cursor=0) {
    const keys = await DataUtil.scan(client, 0, [], name);
    if (keys && keys.length === 1) {
      const key = keys[0];
      const node = await client.hgetall(key);
      const locations = await this.getLocationsByName(client, name);
      node.locations = locations;
      return { cursor, node };
    } else {
      console.log('unable to get customer', 'name', name, 'keys.length', keys.length);
      return;
    }
  }

  async getEdges(client, edgeNames, startCursor, startTiming) {
    let arr = [];
    let cursor = 0;
    edgeNames.forEach((name) => {
      arr.push(this.get(client, name, startCursor + cursor));
      cursor += 1;
    });
    let duration = process.hrtime(startTiming);
    let edges = await Promise.all(arr);
    return { edges, queryDuration: duration.join('.') };
  }

  //return CustomerConnection
  async paginate(client, cursor, count=10) {
    const startTiming = process.hrtime();
    let key = 'customers:list:all';
    const total = await client.llen(key);
    let endCursor = cursor + (count - 1); //zero based stop index
    let edgeNames = await client.lrange(key, cursor, endCursor);
    let { edges, queryDuration } = await this.getEdges(client, edgeNames, cursor, startTiming);

    let pageInfo = {
      total,
      hasNextPage: endCursor < (total - 1), //the final index will be total - 1
      hasPreviousPage: cursor > 0,
      startCursor: cursor,
      endCursor,
      queryDuration
    }
    return {
      edges,
      pageInfo
    };
  }

  async getLocationsByName(client, name) {
    let shortName = name.split(':')[3];
    const resp = await client.hgetall(`locations:${shortName}`);
    let env = {};
    Object.keys(resp).forEach((key) => {
      env[key] = JSON.parse(resp[key]);
    });
    return env;
  }

  async getByName(client, id) {
    const key = `${id}:${DataUtil.CUSTOMER}:*`;
    const result = await client.hgetall(key);
    const locations = await this.getLocationsByName(client, name);
    return Object.assign(result, { locations });
  }

  async getMatchKeys(client, pattern) {
    const searchResult = await DataUtil.scan(client, 0, [], pattern);
    return searchResult;
  }

  async search(client, cursor, count=10, term) { //eslint-disable-line
    let pattern = `*:customer:*${term.toLowerCase()}*`;
    const startTiming = process.hrtime();
    let endCursor = cursor + ( count - 1); //zero based stop index
    let edgeNames = await this.getMatchKeys(client, pattern);
    const total = edgeNames.length;
    let { edges, queryDuration } = await this.getEdges(client, edgeNames, cursor, startTiming);
    let pageInfo = {
      total,
      hasNextPage: endCursor < (total - 1),
      hasPreviousPage: cursor > 0,
      startCursor: cursor,
      endCursor,
      queryDuration
    }
    return { edges, pageInfo };
  }

};
