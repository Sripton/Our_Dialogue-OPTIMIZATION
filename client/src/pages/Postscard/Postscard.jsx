import React, { useContext, useEffect, useState } from "react";
import "./postscard.css";
import { PostContext } from "../Context/PostContextProvider";

export default function Postscard({ post }) {
  //--------------------------------------------------------
  // ------> Логика для кнопки с тремя точками <-------
  // Состояние для управления отображением кнопки с тремя точками
  const [isDotsActive, setIsDotsActive] = useState(false);
  // Функция для переключения состояния отображения меню действий
  const handleDotsActive = () => {
    setIsDotsActive(!isDotsActive);
  };
  // ------> Логика для кнопки с тремя точками <-------
  //--------------------------------------------------------

  //---------------------------------------------------------------------------------------------------
  // Забираем данные из PostContext
  const {
    likePost,
    dislikePost,
    fetchReactionsPosts,
    submitPostReaction,
    userIDSession,
    editPostText,
    setEditPostText,
    submitEditPosts,
    deletePostHandler,
  } = useContext(PostContext);
  // Забираем данные из PostContext
  //---------------------------------------------------------------------------------------------------

  //---------------------------------------------------------------------------------------------------
  // ----------> Логика для реакций на посты <---------
  // Фильтруем массив лайков, оставляя только те, которые относятся к текущему посту
  const postLikes = likePost.filter((like) => like.post_id === post.id);
  // Фильтруем массив дизлайков, оставляя только те, которые относятся к текущему посту
  const postDislikes = dislikePost.filter(
    (dislike) => dislike.post_id === post.id
  );
  // Вызываем функцию загрузки реакций при монтировании компонента
  useEffect(() => {
    fetchReactionsPosts();
  }, []); // Пустой массив зависимостей означает, что эффект сработает только один раз при загрузке компонента
  // ----------> Логика для реакций на посты <---------
  //---------------------------------------------------------------------------------------------------

  //---------------------------------------------------------------------------------------------------
  const [isPostEditActive, setIsPostEditActive] = useState(false);
  const handleEditPostsClick = () => {
    setIsPostEditActive(!isPostEditActive);
    setEditPostText(post.posttitle);
  };

  const handleEditPostsText = (e) => {
    setEditPostText(e.target.value);
  };
  return (
    <div className={`post-section ${isDotsActive ? "showActions" : ""}`}>
      <button type="button" className="toggle-posts-btn">
        Комментарии
      </button>
      <div className="post-list">
        <div className="post">
          {isPostEditActive ? (
            <form
              className="form-post"
              onSubmit={(e) => submitEditPosts(e, post.id, setIsPostEditActive)}
            >
              <textarea
                name="posttitle"
                value={editPostText}
                onChange={handleEditPostsText}
              />
              <button id="submit-post" type="submit">
                Опубликовать
              </button>
            </form>
          ) : (
            <p className="post-text">{post.posttitle}</p>
          )}

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
            {userIDSession !== post.user_id ? (
              ""
            ) : (
              <>
                <button
                  type="button"
                  className="edit-btn"
                  onClick={handleEditPostsClick}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => deletePostHandler(post.id)}
                >
                  Delete
                </button>
              </>
            )}
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
