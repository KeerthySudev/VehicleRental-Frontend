"use client"
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import Navbar from '../components/navbar/navbar';
import { ToastContainer } from 'react-toastify';
import HomePageAdmin from '../components/home/adminHome';

const AdminView = () => {
  return (
    <ApolloProvider client={client}>
       <Navbar/>
       <HomePageAdmin/>
       <ToastContainer/>
   </ApolloProvider>
  );
};
export default AdminView;
