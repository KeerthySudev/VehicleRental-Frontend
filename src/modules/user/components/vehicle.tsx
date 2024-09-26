// components/ImageUploadForm.js
import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';


const ADD_VEHICLE = gql`
  mutation CreateVehicle($name: String!, $description: String!, $price: Float!, $primaryImageFile: Upload!, $secondaryImageFile: Upload!, $availableQty: Int!, $manufacture: String!, $model: String!) {
    createVehicle(name: $name, description: $description, price: $price, primaryImageFile: $primaryImageFile, secondaryImageFile: $secondaryImageFile, availableQty: $availableQty, manufacture: $manufacture, model: $model) {
        availableQty
        description
        id
        manufacture
        model
        name
        price
        primaryImage
        secondaryImage
    }
  }
`;

const GET_ALL_VEHICLES = gql`
  query GetAllVehicles {
    getAllVehicles {
        id
        name
        description
        price
        primaryImage
        secondaryImage
        availableQty
        manufacture
        model
      }
  }
`;


const VehicleForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [manufacture, setManufacture] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState(0);
  const [availableQty, setAvailableQty] = useState(0);
  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [secondaryImageFile, setSecondaryImageFile] = useState(null);
  const { data } = useQuery(GET_ALL_VEHICLES);
  const [addVehicle, { loading, error }] = useMutation(ADD_VEHICLE, {
    onCompleted: (data) => {
      // Reset form or show success message if needed
      setName('');
      setDescription('');
      setAvailableQty(0);
      setManufacture('');
      setModel('');
      setPrice(0);
      setPrimaryImageFile(null);
      setSecondaryImageFile(null);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (primaryImageFile && secondaryImageFile) {
      console.log("data", name, description, price, primaryImageFile, secondaryImageFile, availableQty, manufacture, model);
      try {
        const result = await addVehicle({
          variables: { name, description, price, primaryImageFile, secondaryImageFile, availableQty, manufacture, model }
        });
        console.log("Mutation result:", result);
      } catch (error) {
        console.error("Error adding vehicle:", error);
        if (error.networkError) {
          const { result } = error.networkError;
          console.error("GraphQL Error:", result.errors);
        }
      }
    }
  };
  
  

  return (
    <><form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Image Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required />
        <input
        type="text"
        placeholder="Image model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        required />
        <input
        type="text"
        placeholder="Image Manufacture"
        value={manufacture}
        onChange={(e) => setManufacture(e.target.value)}
        required />
        <input
        type="text"
        placeholder="Image Desc"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required />
        <input
        type="number"
        placeholder="Image QTy"
        value={availableQty}
        onChange={(e) => setAvailableQty(Number(e.target.value))}
        required />
        <input
        type="number"
        placeholder="Image Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        required />
      <input
        type="file"
        onChange={(e) => setPrimaryImageFile(e.target.files[0])}
        required />
        <input
    type="file"
    onChange={(e) => setSecondaryImageFile(e.target.files[0])} // Second file input for extra image
    required
  />
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>
      {error && <p>Error uploading image: {error.message}</p>}
    </form>
    {data && <div>
        {data.getAllVehicles.map((vehicle) => (
          <div key={vehicle.id} style={{ marginBottom: '20px' }}>
            <h3>{vehicle.name}</h3>
            <p>{vehicle.model}</p>
            <p>{vehicle.description}</p>
            <p>{vehicle.manufacture}</p>
            <p>{vehicle.price}</p>
            <p>{vehicle.availableQty}</p>
            <img
              src={vehicle.primaryImage}
              alt={vehicle.name}
              style={{ width: '300px', height: 'auto' }} />
              <img
              src={vehicle.secondaryImage}
              alt={vehicle.name}
              style={{ width: '300px', height: 'auto' }} />
          </div>
        ))}
      </div>}
      </>
  );
};

export default VehicleForm;
