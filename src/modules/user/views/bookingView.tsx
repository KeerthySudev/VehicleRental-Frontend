"use client"
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/apolloClient';
import Navbar from '../components/navbar/navbar';
import BookingsPage from '@/modules/test/components/bookings';
import BookingForm from '@/modules/test/components/test';
import { ToastContainer } from 'react-toastify';

const BookingView = () => {
  return (
    <ApolloProvider client={client}>
      <ToastContainer/>
       <Navbar/>
       <BookingsPage/>
       <BookingForm/>
   </ApolloProvider>
  );
};
export default BookingView;
