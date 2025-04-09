import React from "react";
import { Routes, Route } from "react-router-dom";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/post/:postId" element={<PostDetail />} />
    </Routes>
  );
};

export default App;
