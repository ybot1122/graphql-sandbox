// TODO: https://www.apollographql.com/docs/apollo-server/getting-started

const http = require('http');
const app = require('express')();
const { v4 } = require('uuid');
const { ApolloServer } = require('apollo-server-express');
const {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginDrainHttpServer,
  gql
} = require('apollo-server-core');

const resolvers = {
  Query: {
    books: () => [
      {
        title: 'The Awakening',
        author: 'Kate Chopin'
      },
      {
        title: 'City of Glass',
        author: 'Paul Auster'
      }
    ]
  }
};

// import typeDefs
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  type Query {
    books: [Book]
  }
  type ExampleQuery {
    books: [Book]
  }
`;

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
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ApolloServerPluginDrainHttpServer({ httpServer })
    ]
  });

  await graphqlServer.start();
  graphqlServer.applyMiddleware({ app });

  console.log(`Graphql path is ${graphqlServer.graphqlPath}`);

  if (process.env.NODE_ENV == 'local') {
    // on local dev, do not use HTTP server. just expose on port.
    app.listen(3001, () => {
      console.log(`listening on port 3001`);
    });
  }
};

const httpServer = http.createServer(app);

startApolloServer(app, httpServer);

module.exports = httpServer;
