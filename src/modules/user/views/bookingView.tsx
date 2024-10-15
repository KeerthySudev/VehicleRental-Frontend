"use client"
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import Navbar from '../components/navbar/navbar';
import BookingsPage from '../components/booking/booking';
import { ToastContainer } from 'react-toastify';

const BookingView = () => {
  return (
    <ApolloProvider client={client}>
      <ToastContainer/>
       <Navbar/>
       <BookingsPage/>
   </ApolloProvider>
  );
};
export default BookingView;
