// TODO: https://www.apollographql.com/docs/apollo-server/getting-started

const express = require('express');
const app = express();
const { v4 } = require('uuid');
const { graphql, buildSchema } = require('graphql');

if (process.env.NODE_ENV == 'local') {
  // disable CORS on local dev
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  });
}

app.use(express.json());

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
  books: () => [
    {
      title: 'The Awakening',
      author: 'Kate Chopin'
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster'
    }
  ],
  rollDice: ({ numDice, numSides }) => {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  }
};

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Book {
    title: String!
    author: String!
  }

  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
    books: [Book]
  }
`);

app.post('/api/graphql', async (req, res) => {
  try {
    const { body } = req;

    if (!body.query) throw new Error('Need query');
    if (!body.variables) throw new Error('Need variables');
    // if (!body.operationName) throw new Error("Need operationName");

    const { query, variables, operationName } = body;
    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
      operationName,
      rootValue: resolvers
    });
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(400);
    res.end(JSON.stringify(e));
  }
});

module.exports = app;
