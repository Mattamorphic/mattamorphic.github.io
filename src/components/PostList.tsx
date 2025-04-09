import { useState, useEffect } from "react";
import FilterInput from "./FilterInput";
import SortOrderSelect from "./SortOrderSelect";
import PostItem from "./PostItem";
import styles from "./PostList.module.css"; // Import CSS module

interface Post {
  id: string;
  title: string;
  date: string;
  tags: string[];
  updated: string;
  content: string;
}

interface MarkdownData {
  title: string;
  date: string;
  tags: string[];
  updated: string;
}

interface MarkdownFile {
  content: string;
  data: MarkdownData;
}

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [filterTag, setFilterTag] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Dynamically import all Markdown files from the /posts directory
        const postFiles = import.meta.glob("/src/posts/*.md");
        const loadedPosts: Post[] = [];

        for (const path in postFiles) {

          const module = await postFiles[path]();

          if (module.attributes) {
            const data = module.attributes as MarkdownData;

            loadedPosts.push({
              id: path, // Use the file path as a unique ID
              title: data.title,
              date: data.date,
              tags: data.tags,
              updated: data.updated,
              content: "", // Content is not provided by vite-plugin-markdown
            });
          } else {
            console.error(`Unexpected module format for ${path}`);
          }
        }

        setPosts(loadedPosts);
        setFilteredPosts(loadedPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let updatedPosts = posts;

    if (filterTag) {
      updatedPosts = updatedPosts.filter((post) =>
        post.tags.some((tag) => tag.toLowerCase().includes(filterTag.toLowerCase())),
      );
    }

    updatedPosts = updatedPosts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });

    setFilteredPosts(updatedPosts);
  }, [filterTag, sortOrder, posts]);

  return (
    <div className={styles.container}>
      <div className={styles.filterSortContainer}>
        <FilterInput value={filterTag} onChange={setFilterTag} />
        <SortOrderSelect value={sortOrder} onChange={setSortOrder} />
      </div>
      <ul className={styles.list}>
        {filteredPosts.map((post, index) => (
          <li key={post.id} className={styles.listItem}>
            <PostItem post={post} index={index} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
