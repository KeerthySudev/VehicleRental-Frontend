"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';
import userServices from '../../services/userServices';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
    const router = useRouter();
    const sessionData = sessionStorage.getItem("userData");
  const user = sessionData ? JSON.parse(sessionData) : null;
  const userId = user.id;
    const [customerData, setCustomerData] = useState({
      name: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      password: "",
      confirmPassword: "",
    });
  
    const { data, loading, error, refetch } = useQuery(userServices.GET_CUSTOMER_BY_ID, {
        variables: { id: userId ? parseInt(userId, 10) : null  },  
        skip: !userId,  
      });
      const [imageFile, setImageFile] = useState<File | null>(null);
      const [image, setImage] = useState('');
      const [updateCustomer] = useMutation(userServices.UPDATE_CUSTOMER);

      useEffect(() => {
        if (data) {
          setCustomerData({
            name: data.customer.name,
            email: data.customer.email,
            phone: data.customer.phone,
            city: data.customer.city,
            state: data.customer.state,
            country: data.customer.country,
            pincode: data.customer.pincode,
            password: "",
            confirmPassword: "",

          });
          setImage(data.customer.image);
        }
      }, [data]);
    
      // Loading and error handling
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error fetching customer: {error.message}</p>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomerData({
        ...customerData,
        [e.target.name]: e.target.value,
      });
    };
  
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await updateCustomer({
          variables: {
            id: parseInt(userId),
            data: { ...customerData },
            imageFile : imageFile,
          },
        });
        setImageFile(null);
        refetch();
          toast.success("Profile updated!", {
            position: "top-right",
            autoClose: 2000,
          });
      } catch (err) {
        console.error(err);
      }
    };
  
    return (
        <>
        <div>
        {data && customerData && (
        <div className={styles.container}>
        
        <div className={styles.vehicle}>
        <div className={styles.vehicleDetails}>
        <div className={styles.name}>
        {/* <h2>{customerData.name}</h2> */}
        </div>
        <img src={image} alt={customerData.name} />
        <button disabled={loading} onClick={handleSubmit}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        
        </div>
       
        </div>
        
        <div className={styles.specification}>
                   
  <div className={styles.modalContent}>
        <form>
          <input
            type="text"
            name="name"
            value={customerData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            value={customerData.email}
           readOnly
          />
          <input
            type="text"
            name="phone"
            value={customerData.phone}
            readOnly
          />
          <input
            type="text"
            name="city"
            value={customerData.city}
            onChange={handleChange}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="state"
            value={customerData.state}
            onChange={handleChange}
            placeholder="State"
            required
          />
          <input
            type="text"
            name="country"
            value={customerData.country}
            onChange={handleChange}
            placeholder="Country"
            required
          />
          <input
            type="text"
            name="pincode"
            value={customerData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            required
          />
           <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setImageFile(e.target.files[0]);
            } else {
              setImageFile(null);
            }
          }}
        />
          <input
            type="password"
            name="password"
            value={customerData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={customerData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
          <div className={styles.button}>
        
        </div>
          
          {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        </form>
      </div>
       
        </div>
        
        </div>
        )}
        </div>
   
        </>

  
  

        
  
    );
  };

export default ProfilePage;



