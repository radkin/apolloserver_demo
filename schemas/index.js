module.exports = `
  scalar JSON
  interface Node {
    id: ID!
  }

  type Customer implements Node {
    id: ID!
    name: String
    group: String
    locations: JSON
    baselinePrice: String
  }

  type View implements Node {
    id: ID!
    name: String
    title: String
    customers: CustomerConnection
  }

  type CustomerConnection {
    edges: [CustomerEdge]
    pageInfo: PageInfo!
  }

  type CustomerEdge {
    cursor: String!
    node: Customer
  }

  type PageInfo {
    total: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
    queryDuration: String
  }

  type ProductConnection {
    edges: [ProductEdge]
    pageInfo: PageInfo!
  }

  type ProductEdge {
    cursor: String!
    node: Product
  }

  type Product {
    name: String!
    price: String!
    datePosted: String
    domain: String
  }

  type Location {
    name: String
    label: String
    description: String
  }

  type Object {
    name: String
    label: String
  }

  type SearchResult {
    label: String
  }

  type Message {
    success: Boolean
    message: String
  }

  type Query {
    getProduct(name: String!): Product
    getProducts(
      cursor: Int
      count: Int
    ): ProductConnection
    getCustomers(
      cursor: Int!
      count: Int!
    ): CustomerConnection
    getLocations(count: Int): [Location]
    searchProducts(
      term: String!
      cursor: Int
      count: Int
    ): ProductConnection
    searchCustomers(
      term: String!
      cursor: Int
      count: Int
    ): CustomerConnection
  }
  `;
