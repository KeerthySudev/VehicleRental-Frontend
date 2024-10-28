"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styles from './profile.module.css';
import userServices from '../../services/userServices';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';

const ProfilePage = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userData = Cookies.get("userData");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserId(parsedUser.id); 
    }
  }, []);
    const [customerData, setCustomerData] = useState({
      name: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    });
    const [passwordData, setPasswordData] = useState({
      password: "",
      newPassword: "",
      confirmPassword: "",
    });
  
    const { data, loading, error, refetch } = useQuery(userServices.GET_CUSTOMER_BY_ID, {
        variables: { id: userId ? parseInt(userId, 10) : null  },  
        skip: !userId,  
      });
      const [imageFile, setImageFile] = useState<File | null>(null);
      const [image, setImage] = useState('');
      const [showForm, setShowForm] = useState(false);
      const [updateCustomer , {error : updateError}] = useMutation(userServices.UPDATE_CUSTOMER);
      const [changePassword , {error : passwordError}] = useMutation(userServices.CHANGE_PASSWORD);

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

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordData({
        ...passwordData,
        [e.target.name]: e.target.value,
      });
    };
  
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await updateCustomer({
          variables: {
            id: userId ? parseInt(userId, 10) : null,
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

   
    const handleChangePassword = async () => {
    setShowForm(!showForm);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await changePassword({
          variables: {
            id: userId ? parseInt(userId, 10) : null,
            password : passwordData.password,
            newPassword :passwordData.newPassword,
            confirmPassword :passwordData.confirmPassword,
          },
        });
        refetch();
        setShowForm(false);
        setPasswordData({
          password: "",
          newPassword: "",
          confirmPassword: "",
        });
          toast.success("Password updated!", {
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
        </div>
        <img src={image} alt="Add a profile picture" />
        <button onClick={handleChangePassword} className={styles.vehicleDetailsButton}>
            Change Password
          </button>
        {showForm &&
         <form className={styles.showForm}>
         {passwordError && <p style={{ color: "red" }}>Error: {passwordError.message}</p>}
           <input
             type="password"
             name="password"
             value={passwordData.password}
             onChange={handleFormChange}
             placeholder="Current Password"
             required
           />
            <input
             type="password"
             name="newPassword"
             value={passwordData.newPassword}
             onChange={handleFormChange}
             placeholder="New Password"
             required
           />
           <input
             type="password"
             name="confirmPassword"
             value={passwordData.confirmPassword}
             onChange={handleFormChange}
             placeholder="Confirm Password"
             required
           />
            <button disabled={loading} onClick={handleFormSubmit} className={styles.showFormButton}>
             Submit
           </button>
           <div className={styles.button}>
 
         </div>
         </form>
        }
        </div>
       
        </div>
        
        <div className={styles.specification}>
                   
  <div className={styles.modalContent}>
        <form>
        {updateError && <p style={{ color: "red" }}>Error: {updateError.message}</p>}
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

           <button disabled={loading} onClick={handleSubmit}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
          <div className={styles.button}>

        </div>
          
          {updateError && <p style={{ color: "red" }}>Error: {updateError.message}</p>}
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



