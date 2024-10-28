"use client";

import React, { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
 


  useEffect(() => {
    const userData = Cookies.get("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const handleClick = async () => {
    router.push("/login");
  };


  const handleLogout = () => {
    const confirmToast = () => {
      Cookies.remove("authToken");
      Cookies.remove("userData");

      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    };
    toast.info(
      <div>
        <p>Are you sure you want to log out?</p>
        <button onClick={confirmToast} style={{ marginRight: "10px" }}>
          Yes
        </button>
        <button onClick={() => toast.dismiss()}>No</button>
      </div>,
      {
        position: "top-right",
        autoClose: false,
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="/images/logo.svg" alt="logo" />
        <p>MotoRent</p>
      </div>

      
      <div className={styles.menu}>
        {user ? (
          <>
            <a href="/">Home</a>
            <a href="/vehicles">Cars</a>
            <a href="/booking">Bookings</a>
            <a href="/profile">Profile</a>
          </>
        ) : (
          <>
            <a href="/">Home</a>
            <a href="/vehicles">Cars</a>
          </>
        )}
      </div>
      <div className={styles.signin}>
        {user ? (
          <button onClick={handleLogout}>Sign Out </button>
        ) : (
          <button onClick={handleClick}>Sign In</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
