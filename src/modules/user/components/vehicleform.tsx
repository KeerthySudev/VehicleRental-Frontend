// components/VehicleForm.js
"use client"

import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';


const ADD_VEHICLE = gql`
  mutation AddVehicle(
    $name: String!,
    $description: String!,
    $price: Float!,
    $available_quantity: Int!
  ) {
    addVehicle(
      name: $name,
      description: $description,
      price: $price,
      available_quantity: $available_quantity
    ) {
      id
      name
      description
      price
      available_quantity
    }
  }
`;


const AddVehicleForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      price: '',
      available_quantity: '',
    });
  
    const [addVehicle, { loading, error }] = useMutation(ADD_VEHICLE, {
      onCompleted: (data) => {
        console.log('Vehicle added:', data.addVehicle);
        // Reset form or show success message
        setFormData({
          name: '',
          description: '',
          price: '',
          available_quantity: '',
        });
      },
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'other_images') {
          setFormData({
            ...formData,
            [name]: [...files]
          });
        } else {
          setFormData({
            ...formData,
            [name]: files[0]
          });
        }
      };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        console.log(formData);
        await addVehicle({ variables: { ...formData, price: parseFloat(formData.price), available_quantity: parseInt(formData.available_quantity) } });
      } catch (err) {
        console.error('Error adding vehicle:', err);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
        {/* <input name="primary_image" type="file" onChange={handleFileChange} required /> */}
        <input name="available_quantity" type="number" placeholder="Available Quantity" value={formData.available_quantity} onChange={handleChange} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Vehicle'}
        </button>
        {error && <p>Error adding vehicle: {error.message}</p>}
      </form>
    );
  };
  
  export default AddVehicleForm;
