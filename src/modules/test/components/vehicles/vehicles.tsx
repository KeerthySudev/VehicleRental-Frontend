"use client";

import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import styles from "./vehicles.module.css";

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

const VehiclePage = () => {
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

  const router = useRouter();
  const { data } = useQuery(GET_ALL_VEHICLES);

  const handleClick = (vehicleId: any) => {
    router.push(`http://localhost:3000?id=${encodeURIComponent(vehicleId)}`);
  };

  return (
    <div className={styles.vehicleContainer}>
      <div className={styles.title}>
        <h2>Choose the car that suits you</h2>
        {/* <a href="">View All</a> */}
      </div>

      {data && (
        <div className={styles.cardContainer}>
          {data.getAllVehicles.map((vehicle: Vehicle) => (
            <div key={vehicle.id} className={styles.card}>
              <div className={styles.cardDetails}>
                <img src={vehicle.primaryImage} alt={vehicle.name} />
                <div className={styles.details}>
                  <div className={styles.name}>
                    <h6>{vehicle.manufacture}</h6>
                    <p>{vehicle.model}</p>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default VehiclePage;
