"use client"
import UserForm from '../components/userForm';
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import CustomerRegistrationForm from '../components/test';
import LoginForm from '../components/login';
import AddVehicleForm from '../components/vehicleform';
import AddImageForm from '../components/image';

const AddUserPage = () => {
  return (
    <ApolloProvider client={client}>
      <CustomerRegistrationForm/>
      <UserForm />
      <LoginForm/>
      <AddVehicleForm/>
      <AddImageForm/>
   </ApolloProvider>
  );
};

export default AddUserPage;

