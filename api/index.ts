// TODO: https://www.apollographql.com/docs/apollo-server/getting-started

const app = require('express')();
const { v4 } = require('uuid');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');

const Query_resolver = require('./resolvers/Query.ts');

const resolvers = {
  ...Query_resolver
};

const typeDefs = require('./typedefs/index.ts');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: process.env.NODE_ENV !== 'local',
  cache: 'bounded',
  /**
   * What's up with this embed: true option?
   * These are our recommended settings for using AS;
   * they aren't the defaults in AS3 for backwards-compatibility reasons but
   * will be the defaults in AS4. For production environments, use
   * ApolloServerPluginLandingPageProductionDefault instead.
   **/
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
});

if (process.env.NODE_ENV == 'local') {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });
}

app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-cache');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>. Graphql endpoint is ${graphqlServer.graphqlPath}`);
});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.end(`You Requested Item: ${slug}`);
});

/*
// The `listen` method launches a web server.
graphqlServer.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
*/

graphqlServer.start().then(() => {
  graphqlServer.applyMiddleware({ app });

  if (process.env.NODE_ENV == 'local') {
    app.listen(3001, () => {
      console.log(`Example app listening on port 3001. Graphql path is ${graphqlServer.graphqlPath}`);
    });
  }
});

module.exports = app;
