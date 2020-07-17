const {RESTDataSource} = require('apollo-datasource-rest');
const {scan} = require('./common');
const DataUtil = require('./data-util');
module.exports = class ProductsAPI extends RESTDataSource {

  constructor() {
    super();
  }

  async create( client, {
    name,
    version,
    datePosted,
    domain,
  }) {
    if (!client) throw new Error('productAPI.create failed! Missing required client.');
    const id = DataUtil.createId();
    const key = DataUtil.createRedisKey(DataUtil.PRODUCT, id, null, name, version);
    const result = await client.hmset(key,
      'id', id,
      'name', name,
      'version', version,
      'datePosted', datePosted,
      'domain', domain,
    );
    let isMember = await client.sismember('products:set:all', `${name}:${version}`);
    if (!isMember) {
      await client.sadd('products:set:all', `${name}:${version}`);
      await client.rpush(this.getKey('all', 'all'), key);
    }

    return { success: result === 'OK', message: 'Successfully created product.' };
  }

  async get(client, name, cursor=0) {
    const node = await client.hgetall(name);
    return { cursor, node };
  }

  getKey() {
    return `products:list`;
  }

  async getMatchKeys(client, pattern) {
    const searchResult = await DataUtil.scan(client, 0, [], pattern);
    return searchResult;
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

  async paginate(client, cursor, count=10) {
    const startTiming = process.hrtime();
    const key = this.getKey();
    const total = await client.llen(key);
    let endCursor = cursor + ( count - 1); //zero based stop index
    let edgeNames = await client.lrange(key, cursor, endCursor);
    let { edges, queryDuration } = await this.getEdges(client, edgeNames, cursor, startTiming);
    let pageInfo = {
      hasNextPage: endCursor < (total - 1),
      hasPreviousPage: cursor > 0,
      startCursor: cursor,
      endCursor,
      queryDuration
    }
    return { edges, pageInfo };
  }

  async search(client, cursor, count=10, term) { //eslint-disable-line
    let pattern = `*:product:*${term.toLowerCase()}*`;
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
