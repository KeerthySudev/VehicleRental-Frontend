"use client"
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import LoginForm from '@/modules/auth/components/login/login';
import Navbar from '../components/navbar/navbar';


const LoginView = () => {
  return (
    <ApolloProvider client={client}>
        <Navbar/>
      <LoginForm/>
   </ApolloProvider>
  );
};
export default LoginView;
