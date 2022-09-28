import { isLocal } from '../utils/isLocal';

export const postGraphql = async (query, variables = {}): Promise<Object> => {
  const url = isLocal() ? `http://localhost:3001/api/graphql` : `/api/graphql`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    const data = await res.json();
    return Promise.resolve(data);
  } catch (e) {
    return Promise.resolve(e);
  }
};
