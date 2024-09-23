"use client"

import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

// Define the ADD_USER mutation
const ADD_USER = gql`
  mutation AddUser($name: String!) {
    addUser(name: $name) {
      id
      name
    }
  }
`;

const UserForm = () => {
  const [name, setName] = useState('');
  const [newUser, setNewUser] = useState(null);
  const [addUser, { data, loading, error }] = useMutation(ADD_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const { data } = await addUser({ variables: { name } });
        setNewUser(data.addUser); // Set the new user data
        setName(''); // Clear the input after successful submission
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add a New User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter user's name"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add User'}
        </button>
        {error && <p style={{ color: 'red' }}>Error adding user: {error.message}</p>}
        {newUser && (
          <p style={{ color: 'green' }}>
            User added successfully: ID {newUser.id}, Name: {newUser.name}
          </p>
        )}
      </form>
    </div>
  );
};

export default UserForm;
