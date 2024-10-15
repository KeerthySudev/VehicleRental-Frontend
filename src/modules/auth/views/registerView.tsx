"use client"
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import Navbar from '../components/navbar/navbar';
import RegistrationForm from '../components/register/register';
import { ToastContainer } from 'react-toastify';


const RegisterView = () => {
  return (
    <ApolloProvider client={client}>
        <Navbar/>
        <RegistrationForm/>
        <ToastContainer/>
   </ApolloProvider>
  );
};
export default RegisterView;
