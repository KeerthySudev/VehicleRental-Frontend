"use client"
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import Navbar from '../components/navbar/navbar';
import { ToastContainer } from 'react-toastify';
import ManufacturersPage from '../components/manufacturer/manufacturer';

const ManufacturersView = () => {
  return (
    <ApolloProvider client={client}>
       <Navbar/>
       <ManufacturersPage/>
       <ToastContainer/>
   </ApolloProvider>
  );
};
export default ManufacturersView;
