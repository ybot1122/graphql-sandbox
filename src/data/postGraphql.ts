import { isLocal } from '../utils/isLocal';

var dice = 3;
var sides = 6;
var query = `query RollDice($dice: Int!, $sides: Int) {
  rollDice(numDice: $dice, numSides: $sides)
}`;

export const postGraphql = async (): Promise<Object> => {
  const url = isLocal() ? `http://localhost:3001/api/graphql` : `/api/graphql`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { dice, sides },
      })
    });
    const data = await res.json();
    return Promise.resolve(data);
  } catch(e) {
    return Promise.resolve(e);
  }
};
