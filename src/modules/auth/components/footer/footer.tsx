"use client";

import React from "react";
import styles from "./footer.module.css";

const Footer = () => {

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <div className={styles.logoContainer}>
            <img src="/images/logo.svg" alt="MotoRent Logo" className={styles.footerLogo} />
            <p className={styles.brandName}>MotoRent</p>
          </div>
          <p>MotoRent is your go-to platform for renting high-quality vehicles at affordable prices.</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="">Home</a></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Contact Us</h4>
          <p>Email: support@motoRent.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; 2024 MotoRent. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
