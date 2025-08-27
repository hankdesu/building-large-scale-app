import axios from 'axios';

export async function nativeFetchRequest({
  url = '',
  headers = { 'content-type': 'application/json' },
  method = 'GET',
  body,
  params,
}) {
  try {
    let formatUrl = url;
    const options = {
      method,
      headers,
      ...(body && method !== 'GET' ? { body: JSON.stringify(body) } : {}),
    };

    if (params) {
      const paramsObject = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => paramsObject.append(key, value));
      formatUrl = `${url}?${paramsObject}`;
    }

    const response = await fetch(formatUrl, options);

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
  headers = 'content-type',
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
