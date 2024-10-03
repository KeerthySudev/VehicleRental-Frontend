"use client";

import React,{useState} from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faEye,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./manufacturer.module.css";
import vehicleServices from "../../services/vehicleServices";
import {  Manufacturer, Model } from "../../../../app/types/vehicleType";




const ManufacturersPage = () => {
  const [modelName, setModelName] = useState('');
  const [createModel] = useMutation(vehicleServices.CREATE_MODEL);
  const [showForm, setShowForm] = useState<number | null>(null);
  const { data, loading, error, refetch } = useQuery(vehicleServices.GET_ALL_MANUFACTURERS);
  const [getModelsByManufacturer, { data: modelData, loading: modelLoading, error: modelError, refetch:modelRefetch }] = useLazyQuery(vehicleServices.GET_MODELS_BY_MANUFACTURER);
  const [visibleManufacturerId, setVisibleManufacturerId] = useState<number | null>(null);
  const [deleteManufacturer] = useMutation(vehicleServices.DELETE_MANUFACTURER);
  const [deleteModel] = useMutation(vehicleServices.DELETE_MODEL);
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [createManufacturer] = useMutation(vehicleServices.CREATE_MANUFACTURER, {
    onCompleted: (data) => {
      setName("");
      setImageFile(null);
    },
  });


  const handleFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (imageFile) {
      
        const result = await createManufacturer({
          variables: {
            name,
            imageFile,
          },
        });
        setShowModal(false);
        refetch();
        toast.success("Manufacturer Added!", {
          position: "top-right",
          autoClose: 2000,
        });
        console.log("Mutation result:", result);
      
    }
  };

  const handleAddModel = (id: number) => {
    // Toggle the form visibility
    setShowForm(prevId => (prevId === id ? null : id));
  };

  const handleSubmit = async (manufacturerId: any) => {
    
    try {
        const name = modelName;
      const result = await createModel({
        variables: {
          name,
          manufacturerId: parseInt(manufacturerId),
        },
      });
      setModelName(''); // Clear the input after submission
      setShowForm(null);
      modelRefetch();
      toast.success("Model Added!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      console.error('Error adding model:', err);
    }
  };

  const handleInfo = (id: any) => {
    // Toggle visibility of the manufacturer models
    if (visibleManufacturerId === id) {
      setVisibleManufacturerId(null); // Close if clicked again
    } else {
      setVisibleManufacturerId(id); // Set the clicked manufacturer ID
      getModelsByManufacturer({ variables: {  manufacturerId: parseInt(id, 10) } }); // Fetch models for this manufacturer
    }
  };

  const handleDelete = async(id :any) => {
    const confirmToast = async (id :any) => {
      await deleteManufacturer({
        variables: { id: parseInt(id, 10) },
      });

      toast.success("Deleted!", {
        position: "top-right",
        autoClose: 2000,
      });
      refetch();

      
    };
    toast.info(
      <div>
        <p>Are you sure you want to delete this manufacturer?</p>
        <button onClick={() => confirmToast(id)} style={{ marginRight: "10px" }}>
          Yes
        </button>
        <button onClick={() => toast.dismiss()}>No</button>
      </div>,
      {
        position: "top-right",
        autoClose: 3000,
      }
    );
  };

  const handleModelDelete = async(id :any) => {
    const confirmToast = async (id :any) => {
      await deleteModel({
        variables: { id: parseInt(id, 10) },
      });

      toast.success("Deleted!", {
        position: "top-right",
        autoClose: 2000,
      });
      modelRefetch();
      
    };
    toast.info(
      <div>
        <p>Are you sure you want to delete this model?</p>
        <button onClick={() => confirmToast(id)} style={{ marginRight: "10px" }}>
          Yes
        </button>
        <button onClick={() => toast.dismiss()}>No</button>
      </div>,
      {
        position: "top-right",
        autoClose: 3000,
      }
    );
  };


  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error fetching..: {error.message}</p>;

  return (
    <div className={styles.vehicleContainer}>
        {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Add Manufacturer</h2>
            <form>
              <div>
                <input
                placeholder="Manufacturer"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
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
                  required
                />
              </div>
              <button onClick={(e) => handleFormSubmit(e)} className={styles.submitButton}>
                Add
              </button>
              <button type="button" onClick={() => setShowModal(false)} className={styles.cancelButton}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <div className={styles.title}>
        <h2>Manufacturing Companies</h2>
        <button onClick={() => setShowModal(true)}>Add</button>
      </div>
      {data && (
        <div className={styles.cardContainer}>
          {data.getAllManufacturers.map((manufacturer: Manufacturer) => (
            <div key={manufacturer.id} className={styles.card}>
              <div className={styles.cardDetails}>
                <img src={manufacturer.image} alt={manufacturer.name} />
                <div className={styles.details}>
                  <div className={styles.name}>
                    <h6>{manufacturer.name}</h6>
                  </div>
                </div>
              </div>
              <div className={styles.buttons}>
                <button className={styles.edit}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(manufacturer.id)} className={styles.delete}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button className={styles.info} onClick={() => handleInfo(manufacturer.id)}>
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className={styles.check} onClick={() => handleAddModel(manufacturer.id)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
                   {visibleManufacturerId === manufacturer.id && (
                <div className={styles.modelsContainer} onMouseLeave={() => setVisibleManufacturerId(null)}>
                  {modelLoading ? (
                    <p>Loading models...</p>
                  ) : modelError ? (
                    <p>Error loading models: {modelError.message}</p>
                  ) : modelData && modelData.getModelsByManufacturer.length > 0 ? (
                    modelData.getModelsByManufacturer.map((model: Model) => (
                      <div key={model.id} className={styles.model}>
                        <p>{model.name}</p>
                        <button onClick={() => handleModelDelete(model.id)} className={styles.delete}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                      </div>
                    ))
                  ) : (
                    <div className={styles.model}>
                        <p>No models available for this manufacturer.</p>
                    </div>
                    
                  )}
                </div>
              )}

                {showForm === manufacturer.id && (
                <div className={styles.modelForm} onMouseLeave={() => setShowForm(null)}>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="Enter model name"
                    className={styles.input}
                  />
                  
                  <button
                    className={styles.submitButton}
                    onClick={() => handleSubmit(manufacturer.id)}
                  >
                    Submit
                  </button>
                </div>
              )}


            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ManufacturersPage;
