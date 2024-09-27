"use client"
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import VehicleForm from '../components/vehicle';
import ImageForm from '../components/image';

const AddUserPage = () => {
  return (
    <ApolloProvider client={client}>
      <ImageForm/>
      <VehicleForm/>
   </ApolloProvider>
  );
};
export default AddUserPage;

