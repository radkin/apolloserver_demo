# Apollo Server Demo
Bare bones demo implementation for customers and products

tested:
* node v12.18.2
* npm v16.14.5

# Apollo Server Configuration

## Enable the apollo client to connect
Set the Apollo Client hostname in our CORS whitelist. The environment variable is **CLIENT_HOST**:

`export CLIENT_HOST='my.frontend.client'`

or if using Heroku do it like this:

`heroku config:set CLIENT_HOST='my.apollo.frontend.client' -a my_app_name`

## Heroku Redis special notes
If using Heroku the redis server information is automatically exported using a variable called **REDIS_URL** . Our server.js will use it if that variable is set.

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
