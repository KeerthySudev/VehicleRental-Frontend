"use client";

import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

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
      }
    }
  }
`;

const LoginForm  = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, loading, error }] = useMutation(LOGIN_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({ variables: { email, password } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      </form>
      {data && (
        <div>
          <p>Login successful!</p>
          <p>Welcome, {data.login.user.name}</p>
          {/* <p>Your token: {data.login.token}</p> */}
        </div>
      )}
    </div>
  );
};

export default LoginForm;