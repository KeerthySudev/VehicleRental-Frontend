"use client"
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import Navbar from '../components/navbar/navbar';
import RegistrationForm from '../components/register/register';


const RegisterView = () => {
  return (
    <ApolloProvider client={client}>
        <Navbar/>
        <RegistrationForm/>
   </ApolloProvider>
  );
};
export default RegisterView;
