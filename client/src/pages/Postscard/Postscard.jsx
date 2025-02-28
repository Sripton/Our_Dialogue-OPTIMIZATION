import React, { useContext, useEffect, useState } from "react";
import "./postscard.css";
import axios from "axios";
import { UserContext } from "../Context/UserContextProvider";

export default function Postscard({ post }) {
  // ------> Логика для кнопки с тремя точками <-------
  // Состояние для управления отображением кнопки с тремя точками
  const [isDotsActive, setIsDotsActive] = useState(false);
  // Функция для переключения состояния отображения меню действий
  const handleDotsActive = () => {
    setIsDotsActive(!isDotsActive);
  };
  // ------> Логика для кнопки с тремя точками <-------

  // ------> Логика для добавления а также получения лайков и дизлайков <-------
  // Состояния для хранения лайков  поста
  const [likePost, setlikePost] = useState([]);
  // Состояния для хранения  дизлайков поста
  const [dislikePost, setDislikePost] = useState([]);
  // Получаем ID текущего пользователя из контекста
  const { userIDSession } = useContext(UserContext);

  // Функция создания реакции (лайк/дизлайк)
  const submitPostReaction = async (post_id, reaction_type) => {
    // Проверяем, поставил ли пользователь лайк
    const isLikePost = likePost.some((like) => like.user_id === userIDSession);
    // Проверяем, поставил ли пользователь  дизлайк
    const isDislikePost = dislikePost.some(
      (dislike) => dislike.user_id === userIDSession
    );

    try {
      if (reaction_type === "like" && isLikePost) {
        // Если пользователь уже поставил лайк, удаляем его
        const response = await axios.delete(
          `/api/postreactions/destroypostreaction/${post_id}`,
          {
            user_id: userIDSession,
          }
        );
        if (response.status === 200) {
          // Удаляем лайк из состояния
          setlikePost((prevLike) =>
            Array.isArray(prevLike)
              ? prevLike.filter((like) => like.user_id !== userIDSession)
              : []
          );
        }
      } else if (reaction_type === "dislike" && isDislikePost) {
        // Если пользователь уже поставил дизлайк, удаляем его
        const response = await axios.delete(
          `/api/postreactions/destroypostreaction/${post_id}`,
          {
            user_id: userIDSession,
          }
        );
        if (response.status === 200) {
          // Удаляем дизлайк из состояния
          setDislikePost((prevDislike) =>
            Array.isArray(prevDislike)
              ? prevDislike.filter(
                  (dislike) => dislike.user_id !== userIDSession
                )
              : []
          );
        }
      } else {
        // Если реакции нет, добавляем новую
        const response = await axios.post(`/api/postreactions/${post_id}`, {
          user_id: userIDSession,
          post_id,
          reaction_type,
        });
        if (response.status === 200) {
          const { data } = response;
          if (reaction_type === "like") {
            // Добавляем лайк, убираем дизлайк
            setlikePost((prevPost) => [...prevPost, data]);
            setDislikePost((prevDislike) =>
              prevDislike.filter((dislike) => dislike.user_id !== userIDSession)
            );
          } else if (reaction_type === "dislike") {
            // Добавляем дизлайк, убираем лайк
            setDislikePost((prevDislike) => [...prevDislike, data]);
            setlikePost((prevLike) =>
              prevLike.filter((like) => like.user_id !== userIDSession)
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Получаем лайки поста при загрузке компонента
  useEffect(() => {
    axios
      .get(`/api/postreactions/getlikepost/${post.id}`)
      .then((response) => setlikePost(response.data))
      .catch((err) => console.log(err));
  }, []);
  // Получаем дизлайки поста при загрузке компонента
  useEffect(() => {
    axios
      .get(`/api/postreactions/getdislikepost/${post.id}`)
      .then((response) => setDislikePost(response.data))
      .catch((err) => console.log(err));
  }, []);

  // ------> Логика для добавления а также получения лайков и дизлайков <-------

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
              {likePost ? likePost.length : 0}
            </button>
            <button
              type="button"
              className="dislike-btn"
              onClick={() => submitPostReaction(post.id, "dislike")}
            >
              <ion-icon class="thumbs" name="thumbs-down-outline" />
              {dislikePost ? dislikePost.length : 0}
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
