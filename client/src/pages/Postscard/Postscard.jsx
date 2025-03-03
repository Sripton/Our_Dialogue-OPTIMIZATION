import React, { useContext, useEffect, useState } from "react";
import "./postscard.css";
import { PostContext } from "../Context/PostContextProvider";

export default function Postscard({ post }) {
  // ------> Логика для кнопки с тремя точками <-------
  // Состояние для управления отображением кнопки с тремя точками
  const [isDotsActive, setIsDotsActive] = useState(false);
  // Функция для переключения состояния отображения меню действий
  const handleDotsActive = () => {
    setIsDotsActive(!isDotsActive);
  };
  // ------> Логика для кнопки с тремя точками <-------

  // -----> Получение функции submitPostReaction для создания постов и функции  fetchReactionsPosts для получения постов с помошью useContext <-----
  const { likePost, dislikePost, submitPostReaction, fetchReactionsPosts } =
    useContext(PostContext);
  useEffect(() => {
    fetchReactionsPosts();
  }, []);

  // Фильтруем лайки и дизлайки только для текущего поста
  const postLikes = likePost.filter((like) => like.post_id === post.id);
  const postDislikes = dislikePost.filter(
    (dislike) => dislike.post_id === post.id
  );
  console.log("postLikes", postLikes);
  console.log("postDislikes", postDislikes);
  // -----> Получение функции submitPostReaction для создания постов и функции  fetchReactionsPosts для получения постов с помошью useContext <-----

  return (
    <div className={`post-section ${isDotsActive ? "showActions" : ""}`}>
      <button type="button" className="toggle-posts-btn">
        Комментарии
      </button>
      <div className="post-list">
        <div className="post">
          <p className="post-text">{post.posttitle}</p>
          <div className="post-action">
            <button
              type="button"
              className="like-btn"
              onClick={() => submitPostReaction(post.id, "like")}
            >
              <ion-icon class="thumbs" name="thumbs-up-outline" />
              {postLikes ? postLikes.length : 0}
            </button>
            <button
              type="button"
              className="dislike-btn"
              onClick={() => submitPostReaction(post.id, "dislike")}
            >
              <ion-icon class="thumbs" name="thumbs-down-outline" />
              {postDislikes ? postDislikes.length : 0}
            </button>
            <button type="button" className="reply-btn">
              Reply
            </button>
            <button type="button" className="edit-btn">
              Edit
            </button>
            <button type="button" className="delete-btn">
              Delete
            </button>
            <small className="post-note">{`${post?.User?.name} к теме (${post?.Subject?.subjectName})`}</small>
          </div>
          <div className="dots" onClick={handleDotsActive}>
            {" "}
            &#x2022;&#x2022;&#x2022;
          </div>
          <div className="close-btn" onClick={handleDotsActive}>
            &#10006;
          </div>
        </div>
      </div>
    </div>
  );
}
