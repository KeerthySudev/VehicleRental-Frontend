
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const CREATE_MANUFACTURER = gql`
  mutation CreateManufacturer($name: String!, $imageFile: Upload) {
    createManufacturer(name: $name, imageFile: $imageFile) {
      id
      name
      image
    }
  }
`;

const ManufacturerForm = () => {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [createManufacturer, { loading, error }] = useMutation(CREATE_MANUFACTURER, {
    onCompleted: (data) => {
      // Reset form or show success message if needed
      setName("");
      setImageFile(null);
    },
  });


  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (imageFile) {
      try {
        const result = await createManufacturer({
          variables: {
            name,
            imageFile,
          },
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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Manufacturer Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="image">Manufacturer Image:</label>
        <input
          type="file"
          id="image"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setImageFile(e.target.files[0]);
            } else {
              setImageFile(null);
            }
          }}
        />
      </div>
      <button type="submit">Add Manufacturer</button>
    </form>
  );
};

export default ManufacturerForm;
