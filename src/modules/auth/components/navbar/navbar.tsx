"use client";

import React from "react";
import styles from './navbar.module.css';

const Navbar = () => {
    return(
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src="/images/logo.svg" alt="logo" />
                <p>MotoRent</p>
            </div>
            <div className={styles.menu}>
            <a href="/">Home</a>
            <a href="/vehicles">Vehicles</a>
            </div>
        </div>
    )
}

export default Navbar;