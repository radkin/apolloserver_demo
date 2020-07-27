const { ApolloServer } = require('apollo-server');
const Redis = require('ioredis'); //./lib/redis-client');

const schemas = require('./schemas');
const resolvers = require('./resolvers');
const ProductsAPI = require('./lib/datasources/products-api');
const CustomersAPI = require('./lib/datasources/customers-api');
const LocationsAPI = require('./lib/datasources/locations-api');

const APOLLO_SERVER_PORT = process.env.PORT || '9000';
const CLIENT_HOST = `https://${process.env.CLIENT_HOST}` || 'http://localhost';
// const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const REDIS_URL = process.env.REDIS_URL;

const client = new Redis(REDIS_URL, { showFriendlyErrorStack: true });
const server = new ApolloServer({
  // cors: {
  //     credentials: true,
  //     origin: (origin, callback) => {
  //         const whitelist = [
  //             CLIENT_HOST,
  //         ];
  //
  //         if (whitelist.indexOf(origin) !== -1) {
  //             callback(null, true)
  //         } else {
  //             callback(new Error("Not allowed by CORS"))
  //         }
  //     }
  // },
    typeDefs: schemas,
    resolvers,
    dataSources: () => {
      return {
        productsApi: new ProductsAPI(),
        customersApi: new CustomersAPI(),
        locationsApi: new LocationsAPI(),
      };
    },
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      return { request: req, client }
    }
});

server.listen({ port:APOLLO_SERVER_PORT}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`Try your health check at: ${url}.well-known/apollo/server-health`);
});
