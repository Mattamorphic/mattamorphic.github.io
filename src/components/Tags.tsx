import React from "react";
import styles from "./PostItem.module.css";
import { generateTagColor } from "../utils/tagColors";

interface TagsProps {
  tags: string[];
}

const Tags: React.FC<TagsProps> = ({ tags }) => {
  return (
    <div>
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className={styles["tag"]}
          style={{ backgroundColor: generateTagColor(tag) }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default Tags;
