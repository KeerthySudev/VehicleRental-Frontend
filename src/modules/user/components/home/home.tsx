"use client";

import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from 'next/navigation';
import styles from './home.module.css';

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        city
        country
        email
        id
        name
        phone
        pincode
        state
        role
      }
    }
  }
`;

const UserHome  = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, loading, error }] = useMutation(LOGIN_USER);

  const handleClick = async () => {
    router.push("/register");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await login({ variables: { email, password } });
      
      if (data?.login) {
        // Store the token in sessionStorage
        sessionStorage.setItem('authToken', data.login.token);
        
        // Store user data in sessionStorage (optional, but can be useful)
        sessionStorage.setItem('userData', JSON.stringify(data.login.user));
        
        // Check user role and redirect
        if (data.login.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (

   <div className={styles.container}>
    <div className={styles.banner}>
<div className={styles.content}>
<h1>Experience the road like never before</h1>
<p>Motorent is a vehicle rental company that offers bespoke and competitive services for personal and business clients. Whether you need a car, a van, a people carrier or a minibus, Motorent has a range of vehicles</p>
{/* <button onClick={handleClick}>Sign Up</button> */}
</div>
<div className={styles.form}>
<h3>Book your wheels</h3>
<form onSubmit={handleSubmit}>
<div className={styles.error}> {error && <p> {error.message}</p>}</div>
       
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />   
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </button>
        
      </form>
</div>
    </div>
      
    </div>

  );
};

export default UserHome;