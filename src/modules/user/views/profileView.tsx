"use client";
import { ApolloProvider } from "@apollo/client";
import client from "../../../lib/apolloClient";
import Navbar from "../components/navbar/navbar";
import ProfilePage from "../components/profile/profile";
import { ToastContainer } from "react-toastify";

const ProfileView = () => {
  return (
    <ApolloProvider client={client}>
      <ToastContainer />
      <Navbar />
      <ProfilePage />
    </ApolloProvider>
  );
};

export default ProfileView;
