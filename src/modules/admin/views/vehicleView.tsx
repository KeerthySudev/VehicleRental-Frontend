"use client"
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import Navbar from '../components/navbar/navbar';
import { ToastContainer } from 'react-toastify';
import VehiclePageAdmin from '../components/vehicles/vehicles';

const VehicleView = () => {
  return (
    <ApolloProvider client={client}>
       <Navbar/>
       <VehiclePageAdmin/>
       <ToastContainer/>
   </ApolloProvider>
  );
};
export default VehicleView;