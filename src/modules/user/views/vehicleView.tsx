"use client"
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import Navbar from '../components/navbar/navbar';
import VehiclePage from '../components/vehicle/vehicle';
import { ToastContainer } from 'react-toastify';

const VehicleView = () => {
  return (
    <ApolloProvider client={client}>
      <ToastContainer/>
       <Navbar/>
       <VehiclePage/>
   </ApolloProvider>
  );
};
export default VehicleView;
