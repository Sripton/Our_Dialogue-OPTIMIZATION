import React, { useContext } from "react";
import "./postslist.css";
import Postscard from "../Postscard";
import { PostContext } from "../Context/PostContextProvider";

export default function Postslist() {
  const { posts } = useContext(PostContext);

  return (
    <div className="posts-container">
      {posts?.length && posts?.map((post) => (
        <Postscard key={post.id} post={post} />
      ))}
    </div>
  );
}
