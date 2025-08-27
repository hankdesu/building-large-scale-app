import axios from 'axios';

export async function nativeFetchRequest({
  url = '',
  headers = { 'Content-Type': 'application/json' },
  method = 'GET',
  body,
  params = {},
  ...args
}) {
  try {
    const options = {
      method,
      headers,
      ...(body && method !== 'GET' ? { body: JSON.stringify(body) } : {}),
      ...args,
    };

    const paramsStr = Object.entries(params)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(
            (val, index) =>
              `${encodeURIComponent(`${key}[${index}]`)}=${encodeURIComponent(
                `${val}`
              )}`
          ).join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');

    const formattedUrl = paramsStr ? `${url}?${paramsStr}` : url;

    const response = await fetch(formattedUrl, options);

    if (!response.ok) {
      throw new Error('Response failed!');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function axiosFetchRequest({
  url = '',
  headers = { 'Content-Type': 'application/json' },
  method = 'get',
  body,
  params,
}) {
  try {
    const options = {
      url,
      headers,
      method,
      data: body,
      params,
    };
    const response = await axios.request(options);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function graphqlFetchRequest({ query }) {
    try {
    const options = {
      baseURL: '/graphql',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      data: { query },
    };
    const response = await axios.request(options);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
