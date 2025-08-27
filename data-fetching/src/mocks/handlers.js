import { graphql, HttpResponse } from 'msw';

export const handlers = [
  // Mock Query: GetUsers
  graphql.query('GetUsers', () => {
    return HttpResponse.json([
      { id: '1', name: 'Hank', hometown: 'Taichung' },
      { id: '2', name: 'Amy', hometown: 'Unknown' },
    ]);
  }),
  // Mock Mutation: CreateUser
  graphql.mutation('CreateUser', (req, res, ctx) => {
    const { name, email } = req.variables;
    return res(
      ctx.data({ createUser: { id: Date.now().toString(), name, email } })
    );
  }),
];
