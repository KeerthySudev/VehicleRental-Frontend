"use client";

import React from "react";
import { useQuery} from "@apollo/client";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import styles from "./vehicle.module.css";
import vehicleServices from '../../services/vehicleServices';

const VehiclePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('id'); 
  console.log(vehicleId);
  const { data, loading, error } = useQuery(vehicleServices.GET_VEHICLE_BY_ID, {
    variables: { id: vehicleId ? parseInt(vehicleId, 10) : null  },  // Pass the 'id' as a variable
    skip: !vehicleId,  // Skip query execution if 'id' is not available yet
  });

  const handleClick = (vehicleId: any) => {
    router.push(`http://localhost:3000?id=${encodeURIComponent(vehicleId)}`);
  };
  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error fetching..: {error.message}</p>;
  return (
    <>
<div>
{data && data.getVehicleById && (
<div className={styles.container}>

<div className={styles.vehicle}>
<div className={styles.vehicleDetails}>
<div className={styles.name}>
<h2>{data.getVehicleById.manufacturer?.name} {data.getVehicleById.model?.name} </h2>
<h3>Rs {data.getVehicleById.price} / day</h3>
</div>
<img src={data.getVehicleById.primaryImage} alt={data.getVehicleById.name} />
</div>
<div className={styles.images}>
<img src={data.getVehicleById.secondaryImage} alt={data.getVehicleById.name} />
</div>
</div>

<div className={styles.specification}>
<div className={styles.description}>
  <p>{data.getVehicleById.description}</p>
</div>
{/* <div className={styles.technical}>
  <h3>Technical Specification</h3>
</div> */}
<div className={styles.button}>
  <button onClick={() => handleClick(data.getVehicleById.id)}>Rent now</button>
</div>
</div>

</div>
)}
</div>
</>
  );
};

export default VehiclePage;
