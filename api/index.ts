// TODO: https://www.apollographql.com/docs/apollo-server/getting-started

const app = require('express')();
const { v4 } = require('uuid');

if (process.env.NODE_ENV == 'local') {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });
}

app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.end(`You Requested Item: ${slug}`);
});

if (process.env.NODE_ENV == 'local') {
  app.listen(3001, () => {
    console.log(`Example app listening on port 3001`);
  });
}

module.exports = app;
