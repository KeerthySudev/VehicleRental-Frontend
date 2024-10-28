"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import styles from "./adminHome.module.css";
import vehicleServices from "../../services/vehicleServices";
import { Vehicle } from "../../../../app/types/vehicleType";

const HomePageAdmin = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(vehicleServices.GET_ALL_RENTABLE_VEHICLES);

  const handleViewClick = () => {
    router.push(
      `/admin/vehicles`
    );
  };


  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error fetching..: {error.message}</p>;
  return (
    <div className={styles.vehicleContainer}>
      <div className={styles.title}>
        <h2>Rentable cars..</h2>
        <button onClick={handleViewClick}>View all cars</button>
        {/* <a href="">View All</a> */}
      </div>
      {data && (
        <div className={styles.cardContainer}>
          {data.getAllRentableVehicles.map((vehicle: Vehicle) => (
            <div key={vehicle.id} className={styles.card}>
              <div className={styles.cardDetails}>
                <img src={vehicle.primaryImage} alt={vehicle.name} />
                <div className={styles.details}>
                  <div className={styles.name}>
                    <h6>{vehicle.manufacturer?.name}</h6>
                    <p>{vehicle.model?.name}</p>
                  </div>
                  <div className={styles.price}>
                    <h6>Rs {vehicle.price}</h6>
                    <p>per day</p>
                  </div>
                </div>
              </div>
              {/* <button onClick={() => handleClick(vehicle.id)}>
                View Details
              </button> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePageAdmin;
