import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles['header']}>
      <h1 className={styles['title']}>Mattamorphic</h1>
      <nav className={styles['nav']}>
        <Link to="/" className={styles['link']}>Home</Link>
        <Link to="/about" className={styles['link']}>About</Link>
      </nav>
    </header>
  );
};

export default Header;