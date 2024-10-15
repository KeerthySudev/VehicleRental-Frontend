"use client";
import { ApolloProvider } from "@apollo/client";
import client from "../../../lib/apolloClient";
import Navbar from "../components/navbar/navbar";
import { ToastContainer } from "react-toastify";
import BookingsPage from "../components/booking/booking";

const BookingView = () => {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <BookingsPage />
      <ToastContainer />
    </ApolloProvider>
  );
};
export default BookingView;
