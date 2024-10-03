import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_ALL_MANUFACTURERS = gql`
  query GetAllManufacturers {
    getAllManufacturers {
      id
      name
      image
    }
  }
`;

const GET_MODELS_BY_MANUFACTURER = gql`
query  GetModelsByManufacturer($manufacturerId: Int!) {
    getModelsByManufacturer(manufacturerId: $manufacturerId) {
      id
      name
    }
  }
`
const ADD_VEHICLE = gql`
  mutation CreateVehicle(
    $name: String!
    $description: String!
    $price: Float!
    $primaryImageFile: Upload!
    $secondaryImageFile: Upload!
    $availableQty: Int!
    $manufacturerId: Int!
    $modelId: Int!
  ) {
    createVehicle(
      name: $name
      description: $description
      price: $price
      primaryImageFile: $primaryImageFile
      secondaryImageFile: $secondaryImageFile
      availableQty: $availableQty
      manufacturerId: $manufacturerId
      modelId: $modelId
    ) {
      availableQty
      description
      id
      manufacturer {
        id
        name
        image
      }
      model {
        id
        name
      }
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
      manufacturer{
        name
      }
      model{
        name
      }
    }
  }
`;


const VehicleForm = () => {

  interface Vehicle {
    id: number;
    name: string;
    model: string;
    description: string;
    manufacture: string;
    price: number;
    availableQty: number;
    primaryImage: string;
    secondaryImage: string;
  }

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [manufacturerId, setManufacturerId] = useState(0);
  const [modelId, setModelId] = useState(0);
  const [price, setPrice] = useState(0);
  const [availableQty, setAvailableQty] = useState(0);
  const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null);
  const [secondaryImageFile, setSecondaryImageFile] = useState<File | null>(
    null
  );
  const [models, setModels] = useState([]);
const { loading: loadingManufacturers, error: errorManufacturers, data: dataManufacturers } = useQuery(GET_ALL_MANUFACTURERS);

const { data: modelsData, refetch: fetchModelsByManufacturer, loading: modelsLoading, error: modelsErrors } = useQuery(GET_MODELS_BY_MANUFACTURER, {
    variables: { manufacturerId: manufacturerId || 0 },
    skip: !manufacturerId,
  });

  const [addVehicle ,{loading,error}] = useMutation(ADD_VEHICLE, {
    onCompleted: (data) => {
      // Reset form or show success message if needed
      setName("");
      setDescription("");
      setAvailableQty(0);
      setManufacturerId(0);
      setModelId(0);
      setPrice(0);
      setPrimaryImageFile(null);
      setSecondaryImageFile(null);
    },
  });

  useEffect(() => {
    if (modelsData) {
      setModels(modelsData.getModelsByManufacturer);
    }
  }, [modelsData]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (primaryImageFile && secondaryImageFile) {
      try {
        const result = await addVehicle({
          variables: {
            name,
            description,
            price,
            primaryImageFile,
            secondaryImageFile,
            availableQty,
            manufacturerId,
            modelId,
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
    if (loadingManufacturers) return <p>Loading manufacturers...</p>;
  if (errorManufacturers) return <p>Error fetching manufacturers: {errorManufacturers.message}</p>;
  if (modelsLoading) return <p>Loading models...</p>;
  if (modelsErrors) return <p>Error fetching models: {modelsErrors.message}</p>;
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Image Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
 <select value={modelId} onChange={(e) => setModelId(Number(e.target.value))} required>
        <option value="">Select Manufacturer</option>
        {models.map((model:any) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
             <select value={manufacturerId} onChange={(e) => setManufacturerId(Number(e.target.value))} required>
        <option value="">Select Manufacturer</option>
        {dataManufacturers.getAllManufacturers.map((manufacturer:any) => (
          <option key={manufacturer.id} value={manufacturer.id}>
            {manufacturer.name}
          </option>
        ))}
      </select>
        <input
          type="text"
          placeholder="Image Desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Image QTy"
          value={availableQty}
          onChange={(e) => setAvailableQty(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Image Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setPrimaryImageFile(e.target.files[0]);
            } else {
              setPrimaryImageFile(null);
            }
          }}
        />
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setSecondaryImageFile(e.target.files[0]); // Set file if available
            } else {
              setSecondaryImageFile(null); // Handle null case if needed
            }
          }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Image"}
        </button>
        {error && <p>Error uploading image: {error.message}</p>}
      </form>
      {/* {data && (
        <div>
          {data.getAllVehicles.map((vehicle: Vehicle) => (
            <div key={vehicle.id} style={{ marginBottom: "20px" }}>
              <h3>{vehicle.name}</h3>
              <p>{vehicle.model}</p>
              <p>{vehicle.description}</p>
              <p>{vehicle.manufacture}</p>
              <p>{vehicle.price}</p>
              <p>{vehicle.availableQty}</p>
              <img
                src={vehicle.primaryImage}
                alt={vehicle.name}
                style={{ width: "300px", height: "auto" }}
              />
              <img
                src={vehicle.secondaryImage}
                alt={vehicle.name}
                style={{ width: "300px", height: "auto" }}
              />
            </div>
          ))}
        </div>
      )} */}
    </>
  );

};

export default VehicleForm;
