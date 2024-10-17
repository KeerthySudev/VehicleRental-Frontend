"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from 'next/navigation';
import styles from './register.module.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authServices from "../../services/authServices";

const RegistrationForm = () => {
  const router = useRouter();
   const [sendVerification] = useMutation(authServices.SEND_VERIFICATION);
   const [showModal, setShowModal] = useState(false);
  const [verifyCode] = useMutation(authServices.VERIFY_CODE);
  const phoneNumber = '+916282571196';
  const [code, setCode] = useState('');
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

  const [validateCustomer , { data, loading, error }] = useMutation(authServices.VALIDATE_CUSTOMER);
  const [registerCustomer] = useMutation(authServices.REGISTER_CUSTOMER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async () => {
    router.push("/login");
  };

    const handleSendCode = async () => {
      
    try {
      const { data } = await sendVerification({ variables: { phoneNumber } });
      toast.success("OTP sent to your numer for verification!", {
        position: "top-right",
        autoClose: 2000,
      });
      setCode('');
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const { data } = await verifyCode({ variables: { phoneNumber, code } });
      console.log(data);
      if(data.verifyCode=='Verification successful'){
        await registerCustomer({
          variables: {
            customerInput: { ...customerData },
          },
        });
        setCustomerData({
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
        setShowModal(false);
        toast.success(' Verification successful. User Registered!' , {
          position: "top-right",
          autoClose: 2000,
        }); 
      
        router.push("/login");
      }
      else{
        toast.error(data.verifyCode, {
          position: "top-right",
          autoClose: 2000,
        }); 
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await validateCustomer({
        variables: {
          customerInput: { ...customerData },
        },
      });
      handleSendCode();

     
    } catch (err) {
      console.error(err);
    }
  };

  return (

    <div className={styles.container}>
    <div className={styles.banner}>

<div className={styles.modalContent}>
      <h2>Register here..</h2>
      <form onSubmit={handleSubmit} >
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
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phone"
          value={customerData.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
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
        <button type="submit" disabled={loading}  className={styles.submitButton}>
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        {/* {data && <p style={{ color: "green" }}>Registration Successful</p>} */}
      </form>
    </div>

    <div className={styles.content}>
<h1>Experience the road like never before</h1>
<p>Motorent is a vehicle rental company that offers bespoke and competitive services for personal and business clients. Whether you need a car, a van, a people carrier or a minibus, Motorent has a range of vehicles</p>
<button onClick={handleClick}>Sign In</button>
</div>

    </div>
    {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.otpModalContent} onClick={(e) => e.stopPropagation()}>

            <h4>Enter the otp sent to your phone number for completing the registration</h4>
           
            <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Verification Code"
      />
      <button onClick={handleVerifyCode} className={styles.submitButton}>Verify</button>

          </div>
        </div>
      )}
      
    </div>

  );
};

export default RegistrationForm;
