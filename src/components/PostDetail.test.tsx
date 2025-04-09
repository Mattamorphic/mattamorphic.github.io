import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PostDetail from "./PostDetail";

jest.mock("../posts.json", () => [
  {
    title: "Example Post 1",
    date: "2025-04-01",
    tags: ["tag1", "tag2"],
    content: "This is the content of example post 1.",
  },
  {
    title: "Example Post 2",
    date: "2025-04-02",
    tags: ["tag3", "tag4"],
    content: "This is the content of example post 2.",
  },
]);

describe("PostDetail", () => {
  it("renders the post details when a valid postId is provided", () => {
    render(
      <MemoryRouter initialEntries={["/post/0"]}>
        <Routes>
          <Route path="/post/:postId" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Example Post 1")).toBeInTheDocument();
    expect(screen.getByText("2025-04-01")).toBeInTheDocument();
    expect(screen.getByText("Tags: tag1, tag2")).toBeInTheDocument();
    expect(
      screen.getByText("This is the content of example post 1."),
    ).toBeInTheDocument();
  });

  it('renders "Post not found" when an invalid postId is provided', () => {
    render(
      <MemoryRouter initialEntries={["/post/99"]}>
        <Routes>
          <Route path="/post/:postId" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Post not found")).toBeInTheDocument();
  });
});
