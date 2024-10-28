"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faCheckCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./vehicles.module.css";
import vehicleServices from "../../services/vehicleServices";
import { Manufacturer, Model, Vehicle } from "../../../../app/types/vehicleType";

const VehiclePageAdmin = () => {
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [toggleRentable] = useMutation(vehicleServices.TOGGLE_RENTABLE);
  const [deleteVehicle] = useMutation(vehicleServices.DELETE_VEHICLE);
  const { data, loading, error, refetch } = useQuery(
    vehicleServices.GET_ALL_VEHICLES
  );
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [manufacturerId, setManufacturerId] = useState(0);
  const [modelId, setModelId] = useState(0);
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [gear, setGear] = useState("");
  const [availableQty, setAvailableQty] = useState("");
  const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null);

  const [otherImageFiles, setOtherImageFiles] = useState<File[] | null>(null);

  const [updatePrimaryImageFile, setUpdatePrimaryImageFile] =
    useState<File | null>(null);
  const [updateOtherImageFiles, setUpdateOtherImageFiles] =
    useState<File[] | null>(null);
  const [models, setModels] = useState([]);

  const [updateVehicleData, setUpdateVehicleData] = useState({
    id: "",
    name: "",
    description: "",
    manufacturer: "",
    model: "",
    price: "",
    availableQty: "",
    seats: "",
    fuelType: "",
    gear: "",
  });
  const {
    data: dataManufacturers,
  } = useQuery(vehicleServices.GET_ALL_MANUFACTURERS);

  const [updateVehicle, { error: updateVehicleError }] = useMutation(
    vehicleServices.UPDATE_VEHICLE
  );

  const {
    data: modelsData,
  } = useQuery(vehicleServices.GET_MODELS_BY_MANUFACTURER, {
    variables: { manufacturerId: manufacturerId || 0 },
    skip: !manufacturerId,
  });

  const [
    getVehicleById,
    { data: vehicleData},
  ] = useLazyQuery(vehicleServices.GET_VEHICLE_BY_ID);
  const [importVehicles] = useMutation(vehicleServices.IMPORT_VEHICLES);

  const handleEdit = (id: string | number) => {
    const parsedId = typeof id === 'string' ? parseInt(id, 10) : id;
    getVehicleById({
      variables: { id: id ? parsedId : null },
    });
    setShowEditModal(true);
  };

  const [addVehicle, { error: addVehicleError }] = useMutation(
    vehicleServices.ADD_VEHICLE,
    {
      onCompleted: () => {
        // Reset form or show success message if needed
        setName("");
        setDescription("");
        setAvailableQty("");
        setManufacturerId(0);
        setModelId(0);
        setPrice("");
        setSeats("");
        setGear("");
        setFuelType("");
        setPrimaryImageFile(null);
        setOtherImageFiles(null);
      },
    }
  );

  useEffect(() => {
    if (modelsData) {
      setModels(modelsData.getModelsByManufacturer);
    }
  }, [modelsData]);

  useEffect(() => {
    if (vehicleData) {
      setUpdateVehicleData({
        id: vehicleData.getVehicleById.id,
        name: vehicleData.getVehicleById.name,
        description: vehicleData.getVehicleById.description,
        manufacturer: vehicleData.getVehicleById.manufacturer.name,
        model: vehicleData.getVehicleById.model.name,
        price: vehicleData.getVehicleById.price,
        availableQty: vehicleData.getVehicleById.availableQty,
        seats: vehicleData.getVehicleById.seats,
        fuelType: vehicleData.getVehicleById.fuelType,
        gear: vehicleData.getVehicleById.gear,
      });
    }
  }, [vehicleData]);

  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
  } = useQuery(vehicleServices.SEARCH_VEHICLES, {
    variables: { query: query },
    skip: !query,
  });
  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setQuery(e.target.value); // Update the query as user types
  };


  const vehicles = query
    ? searchData?.searchVehicles || []
    : data?.getAllVehicles || [];

  const handleFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (primaryImageFile) {
      try {
        const result = await addVehicle({
          variables: {
            name,
            description,
            price: parseFloat(price),
            seats: parseInt(seats),
            gear,
            fuelType,
            primaryImageFile,
            otherImageFiles,
            availableQty: parseInt(availableQty),
            manufacturerId,
            modelId,
          },
        });
        toast.success("Vehicle Added!", {
          position: "top-right",
          autoClose: 2000,
        });
        refetch();
        console.log("Mutation result:", result);
      } catch (error) {
        console.error("Error adding vehicle:", error);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdateVehicleData({
      ...updateVehicleData,
      [name]: value,
    });
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateVehicle({
        variables: {
          id: parseInt(updateVehicleData.id),
          data: {
            name: updateVehicleData.name,
            description: updateVehicleData.description,
            price: parseFloat(updateVehicleData.price),
            availableQty: parseInt(updateVehicleData.availableQty),
            seats: parseInt(updateVehicleData.seats),
            fuelType: updateVehicleData.fuelType,
            gear: updateVehicleData.gear,
          },
          primaryImageFile: updatePrimaryImageFile,
          otherImageFiles: updateOtherImageFiles,
        },
      });
      setUpdatePrimaryImageFile(null);
      setUpdateOtherImageFiles(null);
      toast.success("Vehicle updated!", {
        position: "top-right",
        autoClose: 2000,
      });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleImport = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (file) {
      const result = await importVehicles({
        variables: {
          file,
        },
      });
      refetch();
      setShowModal(false);
      toast.success("Vehicles Added!", {
        position: "top-right",
        autoClose: 2000,
      });
      console.log("Mutation result:", result);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmToast = async (id: string | number) => {
      const parsedId = typeof id === 'string' ? parseInt(id, 10) : id;
      await deleteVehicle({
        variables: { id: parsedId },
      });

      toast.success("Deleted!", {
        position: "top-right",
        autoClose: 2000,
      });
      refetch();
    };
    toast.info(
      <div>
        <p>Are you sure you want to delete this vehicle?</p>
        <button
          onClick={() => confirmToast(id)}
          style={{ marginRight: "10px" }}
        >
          Yes
        </button>
        <button onClick={() => toast.dismiss()}>No</button>
      </div>,
      {
        position: "top-right",
        autoClose: 2000,
      }
    );
  };

  const handleRentable = async (id: string | number) => {
    const parsedId = typeof id === 'string' ? parseInt(id, 10) : id;
    await toggleRentable({
      variables: { id: parsedId },
    });
  };

  // This function renders the vehicles
  const renderVehicles = () => {
    // Display loading and error states
    if (searchLoading || loading) return <p>Loading...</p>;
    if (searchError) return <p>Error: {searchError.message}</p>;
    if (error) return <p>Error fetching: {error.message}</p>;

    if (vehicles.length === 0) {
      return <p>No vehicles found.</p>;
    }

    return vehicles.map((vehicle: Vehicle) => (
      <div key={vehicle.id} className={styles.card}>
        <div className={styles.cardDetails}>
          <img src={vehicle.primaryImage} alt={vehicle.name} />
          <div className={styles.details}>
            <div className={styles.name}>
              <h6>{vehicle.manufacturer?.name || vehicle.manufacturerName}</h6>
              <p>{vehicle.model?.name || vehicle.modelName}</p>
            </div>
            <div className={styles.price}>
              <h6>Rs {vehicle.price}</h6>
              <p>per day</p>
            </div>
          </div>
        </div>
        <div className={styles.buttons}>
          <button
            onClick={() => handleEdit(vehicle.id)}
            className={styles.edit}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDelete(vehicle.id)}
            className={styles.delete}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          {/* <button className={styles.info}>
            <FontAwesomeIcon icon={faEye} />
          </button> */}
          {vehicle.isRentable ? (
            <button
              onClick={() => handleRentable(vehicle.id)}
              className={styles.check}
            >
              <FontAwesomeIcon icon={faCheckCircle} />
            </button>
          ) : (
            <button
              onClick={() => handleRentable(vehicle.id)}
              className={styles.cross}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
      </div>
    ));
  };

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error fetching..: {error.message}</p>;
  return (
    <div className={styles.vehicleContainer}>
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Add Vehicle</h2>
            <form onSubmit={(e) => handleFormSubmit(e)}>
              {addVehicleError && (
                <p style={{ color: "red" }}>Error: {addVehicleError.message}</p>
              )}
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className={styles.manufacturer}>
                <select
                  value={manufacturerId}
                  onChange={(e) => setManufacturerId(Number(e.target.value))}
                  required
                >
                  <option value="">Manufacturer</option>
                  {dataManufacturers.getAllManufacturers.map(
                    (manufacturer : Manufacturer) => (
                      <option key={manufacturer.id} value={manufacturer.id}>
                        {manufacturer.name}
                      </option>
                    )
                  )}
                </select>
                <select
                  value={modelId}
                  onChange={(e) => setModelId(Number(e.target.value))}
                  required
                >
                  <option value="">Model</option>
                  {models.map((model: Model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.manufacturer}>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  required
                >
                  <option value="">Fuel Type</option>
                  <option>Petrol</option>
                  <option> Diesel</option>
                </select>

                <select
                  value={gear}
                  onChange={(e) => setGear(e.target.value)}
                  required
                >
                  <option value="">Gearbox</option>
                  <option>Automatic</option>
                  <option> Manual</option>
                </select>
              </div>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
              <div className={styles.numbers}>
                No:of seats:
                 {/* */}
                <input
                  type="number"
                  placeholder="No: of seats"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  min={1}
                  required
                />
                 {/* */}
                Quantity:
                <input
                  type="number"
                  placeholder="Quantity"
                  value={availableQty}
                  min={1}
                  onChange={(e) => setAvailableQty(e.target.value)}
                  required
                />
              </div>
              Price:
              <input
                type="number"
                placeholder="Price"
                value={price}
                min={100}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <div className={styles.files}>
                Primary Image:
                {/* */}
                <input
                
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setPrimaryImageFile(e.target.files[0]);
                    } else {
                      setPrimaryImageFile(null);
                    }
                  }}
                />
                 {/* */}
                Other images:
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      const selectedFiles = Array.from(e.target.files);
                      if (selectedFiles.length > 4) {
                        // Show an alert or handle the error
                        toast.error(
                          "You can only upload a maximum of 4 images!",
                          {
                            position: "top-right",
                            autoClose: 2000,
                          }
                        );
                        setOtherImageFiles(null); // Clear the selection
                      } else {
                        setOtherImageFiles(selectedFiles); // Set files if valid
                      }
                    } else {
                      setOtherImageFiles(null); // Handle null case if needed
                    }
                  }}
                  required
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </form>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
              <p>Import vehicles?</p>
            </div>
            {checked && (
              <form
                onSubmit={(e) => handleImport(e)}
                className={styles.importForm}
              >
                <div>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                      } else {
                        setFile(null);
                      }
                    }}
                    required
                  />
                </div>
                <button type="submit" className={styles.importButton}>
                  Import
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {showEditModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowEditModal(false)}
          
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Edit Vehicle</h2>
            <form onSubmit={(e) => handleEditFormSubmit(e)}>
              {updateVehicleError && (
                <p style={{ color: "red" }}>
                  Error: {updateVehicleError.message}
                </p>
              )}
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={updateVehicleData.name}
                onChange={handleChange}
                required
              />
              <div className={styles.manufacturerInput}>
                <input
                  type="text"
                  value={updateVehicleData.manufacturer}
                  readOnly
                />
                <input type="text" value={updateVehicleData.model} readOnly />
              </div>
              <div className={styles.manufacturer}>
                <select
                  name="fuelType"
                  onChange={handleChange}
                  value={updateVehicleData.fuelType}
                  // onChange={(e) => setFuelType(e.target.value)}
                  required
                >
                  <option value="">Fuel Type</option>
                  <option>Petrol</option>
                  <option> Diesel</option>
                </select>

                <select
                  name="gear"
                  onChange={handleChange}
                  value={updateVehicleData.gear}
                  required
                >
                  <option value="">Gearbox</option>
                  <option>Automatic</option>
                  <option> Manual</option>
                </select>
              </div>
              <textarea
                placeholder="Description"
                name="description"
                value={updateVehicleData.description}
                onChange={handleChange}
                rows={4}
                required
              />
              <div className={styles.numbers}>
                No:of seats:
                {/**/}
                <input
                  type="number"
                  name="seats"
                  placeholder="Seats"
                  value={updateVehicleData.seats}
                  onChange={handleChange}
                  min={1}
                  required
                />
                {/**/}
                Quantity:
                <input
                  type="number"
                  name="availableQty"
                  placeholder="Quantity"
                  min={1}
                  value={updateVehicleData.availableQty}
                  onChange={handleChange}
                  required
                />
              </div>
              Price:
              <input
                type="number"
                name="price"
                min={100}
                placeholder="Price"
                value={updateVehicleData.price}
                onChange={handleChange}
                required
              />
              <div className={styles.files}>
                Primary Image:
                {/**/}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUpdatePrimaryImageFile(e.target.files[0]);
                    } else {
                      setUpdatePrimaryImageFile(null);
                    }
                  }}
                />
                {/**/}
                Other images:
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      const selectedFiles = Array.from(e.target.files);
                      if (selectedFiles.length > 4) {
                        // Show an alert or handle the error
                        toast.error(
                          "You can only upload a maximum of 4 images!",
                          {
                            position: "top-right",
                            autoClose: 2000,
                          }
                        );
                        setUpdateOtherImageFiles(null);
                      } else {
                        setUpdateOtherImageFiles(selectedFiles); // Set files if valid
                      }
                    } else {
                      setUpdateOtherImageFiles(null); // Handle null case if needed
                    }
                  }}
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                Update
              </button>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div className={styles.title}>
        <h2>Available cars..</h2>
        <button onClick={() => setShowModal(true)}>Add</button>
      </div>
      <div className={styles.search}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
        />
      </div>
      {data && <div className={styles.cardContainer}>{renderVehicles()}</div>}
    </div>
  );
};

export default VehiclePageAdmin;
