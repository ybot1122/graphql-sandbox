// TODO: https://www.apollographql.com/docs/apollo-server/getting-started

const app = require('express')();
const { v4 } = require('uuid');
const graphql = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');

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

if (process.env.NODE_ENV == 'local') {
  // on local dev, do not use HTTP server. just expose on port.
  app.listen(3001, () => {
    console.log(`listening on port 3001`);
  });
}

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

const typeDefs = `
  type Book {
    title: String!
    author: String!
  }
  type Query {
    books: [Book]
  }
`;

const schema = makeExecutableSchema({typeDefs, resolvers});

app.post('/api/graphql', async (req, res) => {
  try {
    const { body } = req;
    const { query, variables, operationName } = body;
    const result = await graphql(schema, query, null, variables, operationName);
    res.status(200).json(result);
  } catch(e) {
    res.status(400).json({error: e});
  }
});

module.exports = app;
