# Apollo Server Demo
Bare bones demo implementation for customers and products

tested:
* node v12.18.2
* npm v16.14.5

# Client Configuration
There should be no changes required for CORS if you are using the Apollo Client with **InMemoryCache enabled**. Just simply point to the server with settings like this (Angular pure client):
```bash
providers: [
  {
    provide: APOLLO_OPTIONS,
    useFactory: (httpLink: HttpLink) => {
      return {
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: '/api/graphql'
        })
      };
    },
    deps: [HttpLink]
  },
  ```

### Author
radkin@github.com
