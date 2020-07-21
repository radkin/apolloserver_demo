const { ApolloServer } = require('apollo-server');
const schemas = require('./schemas');
const resolvers = require('./resolvers');
const ProductsAPI = require('./lib/datasources/products-api');
const CustomersAPI = require('./lib/datasources/customers-api');
const LocationsAPI = require('./lib/datasources/locations-api');

const Redis = require('ioredis'); //./lib/redis-client');
const CLIENT_HOST = process.env.CLIENT_HOST || 'localhost';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const client = new Redis(REDIS_URL);
const server = new ApolloServer({
  cors: {
      credentials: true,
      origin: (origin, callback) => {
          const whitelist = [
              `http://${CLIENT_HOST}`,
          ];

          if (whitelist.indexOf(origin) !== -1) {
              callback(null, true)
          } else {
              callback(new Error("Not allowed by CORS"))
          }
      }
  },
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

server.listen({ port:9000}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`Try your health check at: ${url}.well-known/apollo/server-health`);
});
