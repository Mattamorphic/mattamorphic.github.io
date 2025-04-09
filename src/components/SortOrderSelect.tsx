import styles from "./SortOrderSelect.module.css";

interface SortOrderSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const SortOrderSelect = ({ value, onChange }: SortOrderSelectProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.select}
    >
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  );
};

export default SortOrderSelect;
