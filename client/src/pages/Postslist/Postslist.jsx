import React, { useContext, useMemo } from "react";
import "./postslist.css";
import Postscard from "../Postscard";
import { PostContext } from "../Context/PostContextProvider";

export default function Postslist() {
  const { posts, likePost, dislikePost } = useContext(PostContext);

  const postLikeMapMemo = useMemo(() => {
    const map = {};
    likePost.forEach((like) => {
      if (!map[like.post_id]) map[like.post_id] = [];
      map[like.post_id].push(like);
    });
    return map;
  }, [likePost]);

  const postDislikeMapMemo = useMemo(() => {
    const map = {};
    dislikePost.forEach((dislike) => {
      if (!map[dislike.post_id]) map[dislike.post_id] = [];
      map[dislike.post_id].push(dislike);
    });
    return map;
  }, [dislikePost]);

  return (
    <div className="posts-container">
      {posts?.length &&
        posts?.map((post) => (
          <Postscard
            key={post.id}
            post={post}
            postLikeMapMemo={postLikeMapMemo}
            postDislikeMapMemo={postDislikeMapMemo}
          />
        ))}
    </div>
  );
}
