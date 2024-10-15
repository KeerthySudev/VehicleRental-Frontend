"use client";

import React from "react";
import styles from "./navbar.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const router = useRouter();
  const sessionData = sessionStorage?.getItem("userData");
  const user = sessionData ? JSON.parse(sessionData) : null;

  const handleClick = async () => {
    router.push("/login");
  };

  const handleLogout = () => {
    const confirmToast = () => {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userData");

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
            <a href="/vehicles">Vehicles</a>
            <a href="/booking">Bookings</a>
            <a href="/profile">Profile</a>
          </>
        ) : (
          <>
            <a href="/">Home</a>
            <a href="/vehicles">Vehicles</a>
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
