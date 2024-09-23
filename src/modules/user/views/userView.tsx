"use client"
import UserForm from '../components/userForm';
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import CustomerRegistrationForm from '../components/test';

const AddUserPage = () => {
  return (
    <ApolloProvider client={client}>
      <CustomerRegistrationForm/>
      <UserForm />
   </ApolloProvider>
  );
};

export default AddUserPage;

