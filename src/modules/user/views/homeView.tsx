"use client"
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import Navbar from '../components/navbar/navbar';
import UserHome from '../components/home/home';
import VehiclePage from '../components/vehicles/vehicles';
import { ToastContainer } from 'react-toastify';
import Footer from '@/modules/test/components/vehicleform';

const HomeView = () => {
  return (
    <ApolloProvider client={client}>
      <ToastContainer/>
       <Navbar/>
       <UserHome/>
       <VehiclePage/>
   </ApolloProvider>
  );
};

export default HomeView;
