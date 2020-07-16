const { ApolloServer } = require('apollo-server');
const schemas = require('./schemas');
const resolvers = require('./resolvers');
const CustomersAPI = require('./lib/datasources/customers-api');
const LocationsAPI = require('./lib/dataSources/locations-api');

const Redis = require('ioredis');
const REDIS_SERVER = process.env.REDIS_SERVER || 'localhost';
const client = new Redis(6379, REDIS_SERVER);
const server = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  dataSources: () => {
    return {
      customersApi: new CustomersAPI(),
      locationsApi: new LocationsAPI()
    };
  },
  content: async ({ req }) => {
    const token = req.headers.authorization || '';
    return { request: req, client }
  }
});

server.listen({ port:9000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`Try your health check at: ${url}.well-known/apollo/server-health`);
});
