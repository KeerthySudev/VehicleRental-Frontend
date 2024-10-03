import React, { useState, useEffect } from 'react';
import { useQuery, useMutation,gql } from '@apollo/client';

const GET_ALL_MANUFACTURERS = gql`
  query GetAllManufacturers {
    getAllManufacturers {
      id
      name
      image
    }
  }
`;

const CREATE_MODEL = gql`
  mutation CreateModel($name: String!, $manufacturerId: Int!) {
    createModel(name: $name, manufacturerId: $manufacturerId) {
      id
      name
    }
  }
`;

const ModelForm = () => {
  const [name, setName] = useState('');
  const [manufacturerId, setManufacturerId] = useState('');

  const { loading, error, data } = useQuery(GET_ALL_MANUFACTURERS);
  const [createModel] = useMutation(CREATE_MODEL);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createModel({
        variables: {
          name,
          manufacturerId: parseInt(manufacturerId),
        },
      });
      console.log('Model created:', result.data.createModel);
    } catch (err) {
      console.error('Error adding model:', err);
    }
  };

  if (loading) return <p>Loading manufacturers...</p>;
  if (error) return <p>Error fetching manufacturers: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Model Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <select value={manufacturerId} onChange={(e) => setManufacturerId(e.target.value)} required>
        <option value="">Select Manufacturer</option>
        {data.getAllManufacturers.map((manufacturer) => (
          <option key={manufacturer.id} value={manufacturer.id}>
            {manufacturer.name}
          </option>
        ))}
      </select>

      <button type="submit">Add Model</button>
    </form>
  );
};

export default ModelForm;
