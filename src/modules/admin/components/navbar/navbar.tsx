"use client";

import React from "react";
import styles from "./navbar.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const router = useRouter();

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
        <p>MotoRent Admin</p>
      </div>
      <div className={styles.menu}>
        <a href="/admin">Home</a>
        <a href="/admin/vehicles">Vehicles</a>
        <a href="/admin/manufacturers">Manufacturers</a>
        <a href="/admin/allBookings">Bookings</a>
      </div>

      <div className={styles.signin}>
        <button onClick={handleLogout}>Sign Out</button>
      </div>
    </div>
  );
};

export default Navbar;
