"use client"
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import Navbar from '../components/navbar/navbar';
import HomePage from '../components/home/home';
import VehiclePage from '../components/vehicles/vehicles';

const HomeView = () => {
  return (
    <ApolloProvider client={client}>
       <Navbar/>
       {/* <HomePage/> */}
       <VehiclePage/>
   </ApolloProvider>
  );
};
export default HomeView;

