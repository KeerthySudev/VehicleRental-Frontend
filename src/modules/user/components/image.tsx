// components/AddImageForm.js


import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const UPLOAD_IMAGE = gql`
  mutation UploadImage($name: String!, $file: Upload!) {
    uploadImage(name: $name, file: $file) {
      id
      name
      image_path
    }
  }
`;

const AddImageForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    file: null,
  });

  const [uploadImage, { loading, error }] = useMutation(UPLOAD_IMAGE, {
    onCompleted: (data) => {
      console.log('Image uploaded:', data.uploadImage);
      // Reset form or show success message
      setFormData({ name: '', file: null });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await uploadImage({ variables: { ...formData } });
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Image Name" value={formData.name} onChange={handleChange} required />
      <input name="file" type="file" onChange={handleFileChange} required />
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>
      {error && <p>Error uploading image: {error.message}</p>}
    </form>
  );
};

export default AddImageForm;
