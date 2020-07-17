const {scan} = require('../lib/datasources/common');

module.exports = {
  Query: {
    getProducts: async (parent, {cursor, count, isDeleted, isCertified}, { client, account, dataSources }) => {
      return dataSources.productsApi.paginate(client, cursor, count, isDeleted, isCertified);
    },
    //return CustomerConnection
    getCustomers:  async (parent, {cursor, count}, { client, account, dataSources }) => {
      //get full list of names
      return dataSources.customersApi.paginate(client, cursor, count);
    },
    getLocations:  async (parent, {countPerPage}, { client, account, dataSources }) => {
      return dataSources.locationsApi.get(client, countPerPage);
    },
    searchProducts:  async (parent, {cursor, count, term}, { client, account, dataSources }) => {
      return dataSources.productsApi.search(client, cursor, count, term);
    },
    searchCustomers:  async (parent, {cursor, count, term}, { client, account, dataSources }) => {
      return dataSources.customersApi.search(client, cursor, count, term);
    },
  },
};
