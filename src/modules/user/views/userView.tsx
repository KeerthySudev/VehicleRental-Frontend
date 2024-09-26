"use client"
import UserForm from '../components/userForm';
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import CustomerRegistrationForm from '../components/test';
import LoginForm from '../components/login';
import AddVehicleForm from '../components/vehicleform';
import VehicleForm from '../components/vehicle';
import ImageForm from '../components/image';
import PrismaUserForm from '../components/prismauser';

const AddUserPage = () => {
  return (
    <ApolloProvider client={client}>
      {/* <CustomerRegistrationForm/>
      <UserForm />
      <LoginForm/>
      <PrismaUserForm/> */}
      <AddVehicleForm/>
      <ImageForm/>
      <VehicleForm/>
   </ApolloProvider>
  );
};

export default AddUserPage;

