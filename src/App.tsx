import { useEffect, useState } from 'react';
import { fetchItem } from './data/fetchItem';
import { postGraphql } from './data/postGraphql';
import './App.css';

var dice = 3;
var sides = 6;
var query = `query RollDice($dice: Int!, $sides: Int) {
  rollDice(numDice: $dice, numSides: $sides)
}`;

var query2 = `query GetCollection {
  Collec
}`;

var query3 = `query GetBooks {
  books {
    title
    author
  }
}`;

function App() {
  const [data, setData] = useState('');
  const [graphqlData, setGraphqlData] = useState(undefined);
  const [graphqlData2, setGraphqlData2] = useState(undefined);
  const [graphqlData3, setGraphqlData3] = useState(undefined);

  useEffect(() => {
    fetchItem(1).then((text) => setData(text));
    postGraphql(query, {dice, sides}).then((data) => setGraphqlData(data));
    postGraphql(query2).then((data) => setGraphqlData2(data));
    postGraphql(query3).then((data) => setGraphqlData3(data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{JSON.stringify(graphqlData)}</p>
        <p>{JSON.stringify(graphqlData2)}</p>
        <p>{JSON.stringify(graphqlData3)}</p>
        <p>{data}</p>
      </header>
    </div>
  );
}

export default App;
