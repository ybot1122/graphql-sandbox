import { isLocal } from '../utils/isLocal';

export const fetchItem = async (item: number): Promise<string> => {
  const url = isLocal() ? `http://localhost:3001/api/item/${item}` : `/api/item/${item}`;

  try {
    const res = await fetch(url);

    const text = await res.text();

    return Promise.resolve(text);
  } catch {
    return Promise.resolve('api error');
  }
};
