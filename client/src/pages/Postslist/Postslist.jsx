import React, { useContext, useMemo } from "react";
import "./postslist.css";
import Postscard from "../Postscard";
import { PostContext } from "../Context/PostContextProvider";

export default function Postslist() {
  // Получаем данные из контекста PostContext
  // - posts: список всех постов
  // - likePost: массив всех лайков (содержит user_id, post_id и т.д.)
  // - dislikePost: массив всех дизлайков
  const {
    posts,
    likePost,
    dislikePost,
    submitPostReaction,
    deletePostHandler,
    editPostText,
    setEditPostText,
    submitEditPosts
  } = useContext(PostContext);

  // Мемоизированный объект (map), группирующий лайки по post_id
  // Ключом является ID поста, а значением — массив всех лайков к этому посту
  // Это позволяет быстро получить лайки для любого поста по его ID
  const postLikeMapMemo = useMemo(() => {
    const map = {};
    likePost.forEach((like) => {
      // Если для этой реакции ещё не создан массив — создаём
      if (!map[like.post_id]) map[like.post_id] = [];
      // Добавляем лайк в массив по соответствующему post_id
      map[like.post_id].push(like);
    });
    return map;
  }, [likePost]); //  Перерендер происходит только при изменении массива likePost

  // Мемоизированный объект (map), группирующий дизлайки по post_id
  const postDislikeMapMemo = useMemo(() => {
    const map = {};
    dislikePost.forEach((dislike) => {
      // Создаём массив, если он ещё не существует для этого post_id
      if (!map[dislike.post_id]) map[dislike.post_id] = [];
      // Добавляем дизлайк в массив для конкретного post_id
      map[dislike.post_id].push(dislike);
    });
    return map;
  }, [dislikePost]); //  Перерендер происходит только при изменении массива dislikePost

  return (
    <div className="posts-container">
      {posts?.length &&
        posts?.map((post) => (
          <Postscard
            key={post.id}
            post={post}
            postLikeMapMemo={postLikeMapMemo}
            postDislikeMapMemo={postDislikeMapMemo}
            submitPostReaction={submitPostReaction}
            deletePostHandler={deletePostHandler}
            editPostText={editPostText}
            setEditPostText={setEditPostText}
            submitEditPosts={submitEditPosts}
          />
        ))}
    </div>
  );
}
