import React from "react";
import styles from "./FilterInput.module.css";

const FilterInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles['input']}
      placeholder="Filter posts..."
    />
  );
};

export default FilterInput;
