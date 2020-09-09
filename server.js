const { ApolloServer } = require('apollo-server');
const Redis = require('ioredis');

const schemas = require('./schemas');
const resolvers = require('./resolvers');
const ProductsAPI = require('./lib/datasources/products-api');
const CustomersAPI = require('./lib/datasources/customers-api');
const LocationsAPI = require('./lib/datasources/locations-api');

const APOLLO_SERVER_PORT = process.env.PORT || '9000';
const CLIENT_HOST1 = process.env.CLIENT_HOST1 || 'http://localhost';
const CLIENT_HOST2 = process.env.CLIENT_HOST2;
const CLIENT_HOST3 = process.env.CLIENT_HOST3;
const CLIENT_HOST4 = process.env.CLIENT_HOST4;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const client = new Redis(REDIS_URL);
console.log(`Allowing CORS from: ${CLIENT_HOST1}, ${CLIENT_HOST2},
  ${CLIENT_HOST3}, and ${CLIENT_HOST4}`);
const server = new ApolloServer({
  cors: {
      credentials: true,
      origin: (origin, callback) => {
          const whitelist = [
              CLIENT_HOST1,
              CLIENT_HOST2,
              CLIENT_HOST3,
              CLIENT_HOST4
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

server.listen({ port:APOLLO_SERVER_PORT}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`Try your health check at: ${url}.well-known/apollo/server-health`);
});
