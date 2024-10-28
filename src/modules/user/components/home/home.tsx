"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import styles from './home.module.css';
import Cookies from 'js-cookie';


const UserHome  = () => {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    dropoffDate: '',
    dropoffTime: '',
    pickupLocation: '',
    dropoffLocation: '',
    isDifferentDropoff: false,
  });

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    Cookies.set('formData', JSON.stringify(formData), { expires: 1 });
    router.push("/vehicles");
  };

  return (
   <div className={styles.container}>
    <div className={styles.banner}>
<div className={styles.content}>
<h1>Experience the road like never before</h1>
<p>Motorent is a vehicle rental company that offers bespoke and competitive services for personal and business clients. Whether you need a car, a van, a people carrier or a minibus, Motorent has a range of vehicles</p>
{/* <button onClick={handleClick}>Sign Up</button> */}
</div>
<div className={styles.form}>
<h3>Book your wheels</h3>
<form onSubmit={handleSubmit}>
{/* <div className={styles.error}> {error && <p> {error.message}</p>}</div> */}

         <label htmlFor="pickupDate">Pick up Time:</label>
        <div className={styles.inputGroup}>
       <input
          type="date"
          id="pickupDate"
          name="pickupDate"
          value={formData.pickupDate}
          onChange={handleChange}
          min={today}
          required
        />
       <input
          type="time"
          id="pickupTime"
          name="pickupTime"
          value={formData.pickupTime}
          onChange={handleChange}
          required
        />
       </div>
       <input
          type="text"
          id="pickupLocation"
          name="pickupLocation"
          placeholder="Pick up Location"
          value={formData.pickupLocation}
          onChange={handleChange}
          required
        />
      
        <label htmlFor="dropoffTime">Drop off Time:</label>
       <div className={styles.inputGroup}>
       <input
          type="date"
          id="dropoffDate"
          name="dropoffDate"
          value={formData.dropoffDate}
          onChange={handleChange}
          min={formData.pickupDate || today}
          placeholder="Drop off Location"
          required
        />
          <input
          type="time"
          id="dropoffTime"
          name="dropoffTime"
          value={formData.dropoffTime}
          onChange={handleChange}
          placeholder="Drop off Location"
          required
        />
       </div>

       <div className={styles.checkbox}>
        <input
          type="checkbox"
          name="isDifferentDropoff"
          checked={formData.isDifferentDropoff}
          onChange={() => setFormData(prevData => ({ ...prevData, isDifferentDropoff: !prevData.isDifferentDropoff }))}
        />
        <p>Different drop-off location?</p>

       
      </div>
      {formData.isDifferentDropoff &&(
        <input
          type="text"
          id="dropoffLocation"
          name="dropoffLocation"
          placeholder="Drop off Location"
          value={formData.dropoffLocation}
          onChange={handleChange}
          required
        />
      )}     

        <button type="submit"  className={styles.button}>
       Book
        </button>
        
      </form>
</div>
    </div>
      
    </div>

  );
};

export default UserHome;