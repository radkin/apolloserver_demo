const {RESTDataSource} = require('apollo-datasource-rest');
const {scan} = require('./common');
module.exports = class LocationsAPI extends RESTDataSource {
  constructor() {
    super();
  }

  async get(client, countPerPage) {
    const pattern = 'location:*';
    const keys = await scan(client, 0, [], pattern);
    if (keys.length > 0) {
      const promises = [];
      keys.forEach((key) => {
        promises.push(this.getByName(client, key));
      });
      return Promise.all(promises);
    } else {
      console.log('unable to get location', name);
      return [];
    }
  }

  async getByName(client, key) {
    return client.hgetall(key);
  }
};
