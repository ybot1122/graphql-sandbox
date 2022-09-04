import { useEffect, useState } from 'react';
import { fetchItem } from './data/fetchItem';
import './App.css';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    fetchItem(1).then((text) => setData(text));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>{data}</p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
