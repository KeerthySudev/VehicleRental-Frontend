"use client";

import React,{ReactHTMLElement, useState} from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import styles from "./vehicles.module.css";
import vehicleServices from "../../services/vehicleServices";
import { Vehicle } from "../../../../app/types/vehicleType";

const VehiclePage = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('');
  // const { data, loading, error } = useQuery(vehicleServices.GET_ALL_RENTABLE_VEHICLES);
  const { data, loading, error } = useQuery(vehicleServices.GET_ALL_RENTABLE_VEHICLES_SORTED, {
    variables: { sortOrder : sort }, 
  });
  const { data:searchData, loading:searchLoading, error:searchError } = useQuery(vehicleServices.SEARCH_VEHICLES, {
    variables: { query: query   }, 
    skip: !query,  
  });
  
  const handleClick = (vehicleId: any) => {
    router.push(
      `/vehicle?id=${encodeURIComponent(vehicleId)}`
    );
  };
  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error fetching..: {error.message}</p>;


  const handleInputChange = (e: any) => {
    setQuery(e.target.value);
  };
  const handleSortChange = (e: any) => {
    setSort(e.target.value);
  };

  const vehicles = query 
  ? searchData?.searchRentableVehicles|| []
  : data?.getAllRentableVehiclesSorted || [];

 

const renderVehicles = () => {
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
      <button onClick={() => handleClick(vehicle.id)}>
        View Details
      </button>
    </div>
  ))
};


  return (
    <div className={styles.vehicleContainer}>
      <div className={styles.title}>
        <h2>Choose the car that suits you</h2>
      </div>
      <div className={styles.search}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
      />
      <select value={sort} onChange={handleSortChange}>
          <option value="">Sort by price:</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {data && (
        <div className={styles.cardContainer}>
          {renderVehicles()}
          {/* {data.getAllRentableVehicles.map((vehicle: Vehicle) => (
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
      <button onClick={() => handleClick(vehicle.id)}>
        View Details
      </button>
    </div>
  ))} */}







          
        </div>
      )}
    </div>
  );
};

export default VehiclePage;
