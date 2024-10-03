"use client"
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import CustomerRegistrationForm from '../components/test';

const AddUserPage = () => {
  return (
    <ApolloProvider client={client}>
      <CustomerRegistrationForm/>
   </ApolloProvider>
  );
};
export default AddUserPage;

