// components/ImageUploadForm.js
import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';


const UPLOAD_IMAGE = gql`
  mutation UploadImageTest($name: String!, $file: Upload!, $extraFile: Upload!) {
    uploadImageTest(name: $name, file: $file, extraFile: $extraFile) {
      id
      name
      path
      extraPath
    }
  }
`;

const GET_ALL_IMAGES = gql`
  query GetAllImages {
    getAllImages {
      id
      name
      path
      extraPath
    }
  }
`;


const ImageForm = () => {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [extraFile, setExtraFile] = useState(null);
  const { data } = useQuery(GET_ALL_IMAGES);
  const [uploadImage, { loading, error }] = useMutation(UPLOAD_IMAGE, {
    onCompleted: (data) => {
      console.log('Image uploaded:', data.uploadImage);
      // Reset form or show success message if needed
      setName('');
      setFile(null);
      setExtraFile(null);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file && extraFile) {
      await uploadImage({ variables: { name, file , extraFile} });
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
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        required />
        <input
    type="file"
    onChange={(e) => setExtraFile(e.target.files[0])} // Second file input for extra image
    required
  />
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>
      {error && <p>Error uploading image: {error.message}</p>}
    </form>
    {data && <div>
        {data.getAllImages.map((image) => (
          <div key={image.id} style={{ marginBottom: '20px' }}>
            <h3>{image.name}</h3>
            <img
              src={image.path}
              alt={image.name}
              style={{ width: '300px', height: 'auto' }} />
              <img
              src={image.extraPath}
              alt={image.name}
              style={{ width: '300px', height: 'auto' }} />
          </div>
        ))}
      </div>}</>
  );
};

export default ImageForm;
