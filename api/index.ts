// TODO: https://www.apollographql.com/docs/apollo-server/getting-started

const http = require("http");
const app = require('express')();
const { v4 } = require('uuid');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginDrainHttpServer } = require('apollo-server-core');

// import resolvers
const Query_resolver = require('./resolvers/Query.ts');
const resolvers = {
  ...Query_resolver
};

// import typeDefs
const typeDefs = require('./typedefs/index.ts');

if (process.env.NODE_ENV == 'local') {
  // disable CORS on local dev
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });
}

app.get('/api', (req, res) => {
  // Dummy endpoint to test server
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-cache');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
  // Dummy endpoint for fake data
  const { slug } = req.params;
  res.end(`You Requested Item: ${slug}`);
});

const startApolloServer = async (app, httpServer) => {
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: process.env.NODE_ENV !== 'local',
    cache: 'bounded',
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true }), ApolloServerPluginDrainHttpServer({ httpServer })]
  });

  await graphqlServer.start();
  graphqlServer.applyMiddleware({ app });

  if (process.env.NODE_ENV == 'local') {
    // on local dev, do not use HTTP server. just expose on port.
    app.listen(3001, () => {
      console.log(`Example app listening on port 3001. Graphql path is ${graphqlServer.graphqlPath}`);
    });
  }  
};

const httpServer = http.createServer(app);

startApolloServer(app, httpServer);

module.exports = httpServer;
