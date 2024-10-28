"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import authServices from "../../services/authServices";
import Cookies from 'js-cookie';

const LoginForm  = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error }] = useMutation(authServices.LOGIN_USER);

  const handleClick = async () => {
    router.push("/register");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await login({ variables: { email, password } });
      
      if (data?.login) {
        
        Cookies.set('authToken', data.login.token, { expires: 1/24 });
        Cookies.set('userData', JSON.stringify(data.login.user), { expires: 1/24 });
        
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
<button onClick={handleClick}>Sign Up</button>
</div>
<div className={styles.form}>
<h3>Sign In</h3>
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

export default LoginForm;