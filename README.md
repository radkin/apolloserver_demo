# Apollo Server Demo
Bare bones demo implementation for customers and products

tested:
* node v12.18.2
* npm v16.14.5

# Apollo Server Configuration

## CORS - Enable the apollo client to connect
Set the Apollo Client hostname in our CORS whitelist with an environment variable.

 **CLIENT_HOST1**: `export CLIENT_HOST1='my.frontend.client'`

* For instance, to run locally with nginx port forwarding 9000 to 80
`export CLIENT_HOST1="http://localhost"`
* The client expects to use this URL when running in a dev environment
`http://localhost:9000/api/graphql`

**note** attempting to set the port will fail! For Example:
`http://localhost:9000` does not work.

* If using _Heroku_ do it like this:
`heroku config:set CLIENT_HOST1='my.apollo.frontend.client' -a my_app_name`

_please see apolloclient-demo for an **nginx.conf** suitable for development_

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
If you decide to set the client uri with a variable it will look like this:

`const apolloServer = 'http://localhost:9000/api/graphql';`

# Docker Instructions

## Build the container
build an Apollo Server docker image (remove brackets) like this:

`docker build -t [container-name:][version] .`

## Docker Compose
A docker-compose file has been provided to facilitate build automation, locally run environments, and K8S cloud compute scaling.

### Running a local Apollo Server with docker
When you run the command below you will notice that it starts up an Apollo Server instance, redis replica, and redis primary server. This is by design as we need to simulate the read-only, one way replication expected from a replica.

```bash
docker pull radkin/apolloserver:latest
docker-compose up -d
```

### Scaling apolloserver horizontally

This command will allow you to run an additional apolloserver

`docker-compose scale apolloserver=2`

### Watching containers and logging
A good way to keep an eye on the containers is the open four horizontal windows and run the following commands (in order)
`docker-compose up -d`
then, in the same window, start the first command and move to the next with each subsequent command.
```bash
watch docker ps
docker logs -f `docker ps | grep master | cut -d' ' -f1`
docker logs -f `docker ps | grep replica | cut -d' ' -f1`
docker logs -f `docker ps | grep apolloserver_1 | cut -d' ' -f1`
```

### Loading test data
Test data is automatically loaded when starting up the cluster. It is hard set for redis port 6329, as is apollo. When running in Heroku this needs to be set manually and loaded via remote connection to the redis instance provided by Heroku.

### Author
radkin@github.com
