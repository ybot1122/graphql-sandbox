import { useEffect, useState } from 'react';
import { fetchItem } from './data/fetchItem';
import { postGraphql } from './data/postGraphql';
import { Card } from './Card/Card';
import './App.css';

var dice = 3;
var sides = 6;
var query = `query RollDice($dice: Int!, $sides: Int) {
  rollDice(numDice: $dice, numSides: $sides)
}`;

var query2 = `query GetCollection {
  collection {
    title
    description
    brand
    key
  }
}`;

var query3 = `query GetBooks {
  books {
    title
    author
  }
}`;

function App() {
  const [data, setData] = useState('');
  const [diceRoll, setDiceRoll] = useState(undefined);
  const [collections, setCollections] = useState(undefined);
  const [books, setBooks] = useState(undefined);

  useEffect(() => {
    fetchItem(1).then((text) => setData(text));
    postGraphql(query, { dice, sides }).then((data) => setDiceRoll(data));
    postGraphql(query2).then((data) => setCollections(data));
    postGraphql(query3).then((data) => setBooks(data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">Welcome</header>
      {collections?.data.collection.map((el) => (
        <Card title={el.title} description={el.description} key={el.key} />
      ))}
      <p className="rawjson">{JSON.stringify(diceRoll)}</p>
      <p className="rawjson">{JSON.stringify(collections)}</p>
      <p className="rawjson">{JSON.stringify(books)}</p>
      <p className="rawjson">{data}</p>
    </div>
  );
}

export default App;
