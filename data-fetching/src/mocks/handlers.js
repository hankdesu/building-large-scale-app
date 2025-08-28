import { graphql, HttpResponse } from 'msw';
import { graphql as executeGraphql, buildSchema } from 'graphql';

const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    hometown: String!
  }

  type Query {
    users: [User!]
  }
`);

const users = [
  { id: '1', name: 'Hank', hometown: 'Taichung' },
  { id: '2', name: 'Amy', hometown: 'Taipei' },
];

const resolvers = {
  users: () => users,
};

export const handlers = [
  graphql.operation(async ({ query, variables }) => {
    try {
      const { data } = await executeGraphql({
        schema,
        source: query,
        variableValues: variables,
        rootValue: resolvers,
      });

      return HttpResponse.json(data || {});
    } catch (error) {
      console.error('GraphQL execution error: ', error);
      return HttpResponse.json({
        errors: [{ message: error.message }],
      });
    }
  }),
];
