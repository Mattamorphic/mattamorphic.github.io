import React from "react";
import { Link } from "react-router-dom";
import styles from "./PostItem.module.css";
import Tags from "./Tags";
import FormattedDate from "./FormattedDate";

export interface PostItemProps {
  post: {
    title: string;
    date: string;
    tags: string[];
  };
  index: number;
}

const PostItem = ({ post, index }: PostItemProps) => {
  return (
    <div className={styles["post-item"]}>
      <h2>
        <Link to={`/post/${index}`}>{post.title}</Link>
      </h2>
      <p><FormattedDate date={post.date} /></p>
      <Tags tags={post.tags} />
    </div>
  );
};

export default PostItem;
