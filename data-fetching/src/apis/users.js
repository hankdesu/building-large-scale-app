import userData from '../mocks/db.json';
import { axiosFetchRequest, graphqlFetchRequest } from '../utils/fetchRequest';

export async function fetchLatestUser() {
  const data = await axiosFetchRequest({
    url: `http://localhost:3000/users/`,
    params: { _sort: '-id', _start: 0, _end: 1 },
  });

  return data.pop();
}

export async function insertUser(user) {
  const { users } = userData;
  const incrementedId = users[users.length - 1].id + 1;
  const body = {
    ...user,
    id: incrementedId,
  };

  const data = await axiosFetchRequest({
    url: `http://localhost:3000/users`,
    method: 'POST',
    body,
  });

  return data;
}

export async function graphqlLatestUser() {
  const query = `
  query GetUsers {
    users {
      id
      name
    }
  }
`;

  const data = await graphqlFetchRequest({ query });
  console.log('data: ', data);

  return data.pop();
}
