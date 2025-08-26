import axios from 'axios';

export async function nativeFetchRequest({
  url = '',
  headers = { 'content-type': 'application/json' },
  method = 'GET',
  body,
}) {
  try {
    const options = {
      method,
      headers,
      ...(body && method !== 'GET' ? { body: JSON.stringify(body) } : {}),
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error('Response failed!');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function axiosFetchRequest({
  url = '',
  headers = 'content-type',
  method = 'get',
  body,
}) {
  try {
    const options = {
      url,
      headers,
      method,
      data: body,
    };
    const response = await axios.request(options);

    console.log('response: ', response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
