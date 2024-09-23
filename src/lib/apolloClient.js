import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:5000/graphql', // Adjust this to your backend's GraphQL endpoint
  }),
  cache: new InMemoryCache(),
});
console.log('Apollo Client:', client);

export default client;