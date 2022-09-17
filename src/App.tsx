import { useEffect, useState } from 'react';
import { fetchItem } from './data/fetchItem';
import { postGraphql } from './data/postGraphql';
import './App.css';

function App() {
  const [data, setData] = useState('');
  const [graphqlData, setGraphqlData] = useState(undefined);

  useEffect(() => {
    fetchItem(1).then((text) => setData(text));
    postGraphql().then((data) => setGraphqlData(data));
  }, []);

  

  return (
    <div className="App">
      <header className="App-header">
        <p>{JSON.stringify(graphqlData)}</p>
        <p>{data}</p>
      </header>
    </div>
  );
}

export default App;
