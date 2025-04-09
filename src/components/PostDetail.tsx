import { useParams } from "react-router-dom";
import posts from "../posts.json";
import styles from "./PostDetail.module.css";
import Tags from "./Tags";
import FormattedDate from "./FormattedDate";

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const post = postId ? posts[parseInt(postId, 10)] : undefined;

  if (!postId || !post) {
    return <div>Post not found</div>;
  }

  return (
    <div className={styles.postDetail}>
      <h1>{post.title}</h1>
      <p><FormattedDate date={post.date} /></p>
      <Tags tags={post.tags} />
      <div>{post.content}</div>
    </div>
  );
};

export default PostDetail;
