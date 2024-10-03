"use client";

import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from 'next/navigation';
import styles from './register.module.css';

// Define the REGISTER_CUSTOMER mutation
const REGISTER_CUSTOMER = gql`
  mutation RegisterCustomer($customerInput: CustomerInput!) {
    registerCustomer(customerInput: $customerInput) {
      id
      name
      email
      phone
    }
  }
`;

const RegistrationForm = () => {
  const router = useRouter();
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  });

  const [registerCustomer, { data, loading, error }] = useMutation(REGISTER_CUSTOMER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async () => {
    router.push("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registerCustomer({
        variables: {
          customerInput: { ...customerData },
        },
      });
      setCustomerData({
        name: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (

    <div className={styles.container}>
    <div className={styles.banner}>

<div className={styles.modalContent}>
      <h2>Register here..</h2>
      <form onSubmit={handleSubmit} >
        <input
          type="text"
          name="name"
          value={customerData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={customerData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phone"
          value={customerData.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
        <input
          type="text"
          name="city"
          value={customerData.city}
          onChange={handleChange}
          placeholder="City"
          required
        />
        <input
          type="text"
          name="state"
          value={customerData.state}
          onChange={handleChange}
          placeholder="State"
          required
        />
        <input
          type="text"
          name="country"
          value={customerData.country}
          onChange={handleChange}
          placeholder="Country"
          required
        />
        <input
          type="text"
          name="pincode"
          value={customerData.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          required
        />
        <input
          type="password"
          name="password"
          value={customerData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={customerData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
        />
        <button type="submit" disabled={loading}  className={styles.submitButton}>
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        {data && <p style={{ color: "green" }}>Registration Successful</p>}
      </form>
    </div>

    <div className={styles.content}>
<h1>Experience the road like never before</h1>
<p>Motorent is a vehicle rental company that offers bespoke and competitive services for personal and business clients. Whether you need a car, a van, a people carrier or a minibus, Motorent has a range of vehicles</p>
<button onClick={handleClick}>Sign In</button>
</div>

    </div>
      
    </div>

  );
};

export default RegistrationForm;
