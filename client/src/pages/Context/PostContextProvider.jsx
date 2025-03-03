import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import { UserContext } from "./UserContextProvider";

const PostContext = React.createContext();

export default function PostContextProvider({ children }) {
  // ------------> Логика для создания постов в компоненте Addposts.jsx <------------
  // Состояние для хранения значений полей формы
  const [inputsPosts, setInputsPosts] = useState({});
  // Состояние для хранения списка постов, полученных от сервера
  const [posts, setPosts] = useState([]);

  // Получаем параметр id из URL
  const { id } = useParams();

  // Функция для обработки изменений в полях ввода формы
  const inputsPostHandler = (e) => {
    // Используем предыдущее состояние, чтобы обновить только изменённое поле
    setInputsPosts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Функция для обработки отправки формы
  const submitPostsHandler = async (e) => {
    // Предотвращаем стандартное поведение формы (перезагрузку страницы)
    e.preventDefault();
    try {
      // Отправляем POST-запрос на сервер для создания нового поста
      const response = await axios.post(`/api/posts/${id}`, inputsPosts);
      // await axios.post(`/api/posts/${id}`, inputs);
      // Загружаем все посты заново
      // const response = await axios.get(`/api/posts/${id}`);
      // Если запрос успешен
      if (response.status === 200) {
        // Извлекаем данные из ответа
        const { data } = response;
        // Обновляем состояние posts, чтобы отобразить новый пост
        //  setPosts(data);
        setPosts((prevPosts) => [...prevPosts, data]);
      }
    } catch (error) {
      // Выводим ошибку в консоль, если запрос не удался
      console.log(error);
    }
  };

  // useEffect выполняется при первом рендере компонента
  useEffect(() => {
    // Получаем список постов с сервера при загрузке компонента
    axios
      .get(`/api/posts/${id}`)
      // Обновляем состояние posts полученными данными
      .then((response) => setPosts(response.data))
      // Логируем ошибку, если запрос не удался
      .catch((err) => console.log(err));
    // Пустой массив зависимостей означает,
    // что эффект выполняется только один раз при монтировании компонента
  }, []);
  // ------------> Логика для создания постов в компоненте Addposts.jsx <------------

  // ------------> Логика для создания реакций для постов <------------
  // Состояния для хранения лайков  поста
  const [likePost, setlikePost] = useState([]);
  // Состояния для хранения  дизлайков поста
  const [dislikePost, setDislikePost] = useState([]);
  // Получаем ID текущего пользователя из контекста
  const { userIDSession } = useContext(UserContext);

  const fetchReactionsPosts = async () => {
    try {
      const likeReponse = await axios.get(`/api/postreactions/getlikepost`);
      const dislikeResponse = await axios.get(
        `/api/postreactions/getdislikepost`
      );
      setlikePost(likeReponse.data || []);
      setDislikePost(dislikeResponse.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  // Функция создания реакции (лайк/дизлайк)
  // const submitPostReaction = async (post_id, reaction_type) => {
  //   // Проверяем, поставил ли пользователь лайк
  //   const isLikePost = likePost.some(
  //     (like) => like.user_id === userIDSession && like.post_id === post_id
  //   );
  //   // Проверяем, поставил ли пользователь  дизлайк
  //   const isDislikePost = dislikePost.some(
  //     (dislike) =>
  //       dislike.user_id === userIDSession && dislike.post_id === post_id
  //   );

  //   try {
  //     if (reaction_type === "like" && isLikePost) {
  //       // Если пользователь уже поставил лайк, удаляем его
  //       const response = await axios.delete(
  //         `/api/postreactions/destroypostreaction/${post_id}`,
  //         { data: { user_id: userIDSession } }
  //       );
  //       if (response.status === 200) {
  //         // Удаляем лайк из состояния
  //         setlikePost((prevLike) =>
  //           Array.isArray(prevLike)
  //             ? prevLike.filter((like) => like.user_id !== userIDSession)
  //             : []
  //         );
  //       }
  //     } else if (reaction_type === "dislike" && isDislikePost) {
  //       // Если пользователь уже поставил дизлайк, удаляем его
  //       const response = await axios.delete(
  //         `/api/postreactions/destroypostreaction/${post_id}`,
  //         { data: { user_id: userIDSession } }
  //       );
  //       if (response.status === 200) {
  //         // Удаляем дизлайк из состояния
  //         setDislikePost((prevDislike) =>
  //           Array.isArray(prevDislike)
  //             ? prevDislike.filter(
  //                 (dislike) => dislike.user_id !== userIDSession
  //               )
  //             : []
  //         );
  //       }
  //     } else {
  //       // Если реакции нет, добавляем новую
  //       const response = await axios.post(`/api/postreactions/${post_id}`, {
  //         user_id: userIDSession,
  //         post_id,
  //         reaction_type,
  //       });
  //       if (response.status === 200) {
  //         const { data } = response;
  //         if (reaction_type === "like") {
  //           // Добавляем лайк, убираем дизлайк
  //           setlikePost((prevPost) => [...prevPost, data]);
  //           setDislikePost((prevDislike) =>
  //             prevDislike.filter((dislike) => dislike.user_id !== userIDSession)
  //           );
  //         } else if (reaction_type === "dislike") {
  //           // Добавляем дизлайк, убираем лайк
  //           setDislikePost((prevDislike) => [...prevDislike, data]);
  //           setlikePost((prevLike) =>
  //             prevLike.filter((like) => like.user_id !== userIDSession)
  //           );
  //         }
  //       }
  //       fetchReactionsPosts();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const submitPostReaction = async (post_id, reaction_type) => {
    // Проверяем, поставил ли пользователь лайк или дизлайк к этому посту
    const isLikePost = likePost.some(
      (like) => like.user_id === userIDSession && like.post_id === post_id
    );
    const isDislikePost = dislikePost.some(
      (dislike) =>
        dislike.user_id === userIDSession && dislike.post_id === post_id
    );

    try {
      if (reaction_type === "like" && isLikePost) {
        // удаляем лайк локально
        setlikePost((prevLike) =>
          prevLike.filter(
            (like) =>
              !(like.user_id === userIDSession && like.post_id === post_id)
          )
        );
        // удаляем лайк c сервера
        await axios.delete(
          `/api/postreactions/destroypostreaction/${post_id}`,
          { data: { user_id: userIDSession } }
        );
      } else if (reaction_type === "dislike" && isDislikePost) {
        // удаляем дизлайк локально
        setDislikePost((prevDislike) =>
          prevDislike.filter(
            (dislike) =>
              !(
                dislike.user_id === userIDSession && dislike.post_id === post_id
              )
          )
        );
        // удаляем дизлайк c сервера
        await axios.delete(
          `/api/postreactions/destroypostreaction/${post_id}`,
          { data: { user_id: userIDSession } }
        );
      } else {
        // Если реакции нет, добавляем её
        const response = await axios.post(`/api/postreactions/${post_id}`, {
          user_id: userIDSession,
          post_id,
          reaction_type,
        });
        if (response.status === 200) {
          const { data } = response;
          if (reaction_type === "like") {
            // Добавляем лайк локально и удаляем возможный дизлайк
            setlikePost((prevLike) => [
              ...prevLike.filter(
                (like) =>
                  !(like.user_id === userIDSession && like.post_id === post_id)
              ),
              data,
            ]);
            setDislikePost((prevDislike) =>
              prevDislike.filter((dislike) => dislike.user_id !== userIDSession)
            );
          }
        } else if (reaction_type === "dislike") {
          // Добавляем дизлайк локально и удаляем возможный лайк
          setDislikePost((prevDislike) => [
            ...prevDislike.filter(
              (dislike) =>
                !(
                  dislike.user_id === userIDSession &&
                  dislike.post_id === post_id
                )
            ),
            data,
          ]);
          setlikePost((prevLike) =>
            prevLike.filter((like) => like.user_id !== userIDSession)
          );
        }
      }
      // После изменений обновляем данные с сервера
      fetchReactionsPosts();
    } catch (error) {
      console.log(error);
    }
  };
  // const submitPostReaction = async (post_id, reaction_type) => {
  //   // Проверяем, поставил ли пользователь лайк или дизлайк к этому посту
  //   const isLikePost = likePost.some(
  //     (like) => like.user_id === userIDSession && like.post_id === post_id
  //   );
  //   const isDislikePost = dislikePost.some(
  //     (dislike) =>
  //       dislike.user_id === userIDSession && dislike.post_id === post_id
  //   );

  //   try {
  //     if (reaction_type === "like" && isLikePost) {
  //       // Удаляем лайк локально
  //       setlikePost((prevLike) =>
  //         prevLike.filter(
  //           (like) =>
  //             !(like.user_id === userIDSession && like.post_id === post_id)
  //         )
  //       );

  //       // Удаляем лайк на сервере
  //       await axios.delete(
  //         `/api/postreactions/destroypostreaction/${post_id}`,
  //         {
  //           data: { user_id: userIDSession },
  //         }
  //       );
  //     } else if (reaction_type === "dislike" && isDislikePost) {
  //       // Удаляем дизлайк локально
  //       setDislikePost((prevDislike) =>
  //         prevDislike.filter(
  //           (dislike) =>
  //             !(
  //               dislike.user_id === userIDSession && dislike.post_id === post_id
  //             )
  //         )
  //       );

  //       // Удаляем дизлайк на сервере
  //       await axios.delete(
  //         `/api/postreactions/destroypostreaction/${post_id}`,
  //         {
  //           data: { user_id: userIDSession },
  //         }
  //       );
  //     } else {
  //       // Если реакции нет, добавляем её
  //       const response = await axios.post(`/api/postreactions/${post_id}`, {
  //         user_id: userIDSession,
  //         post_id,
  //         reaction_type,
  //       });

  //       if (response.status === 200) {
  //         const { data } = response;
  //         if (reaction_type === "like") {
  //           // Добавляем лайк локально и удаляем возможный дизлайк
  //           setlikePost((prevLike) => [
  //             ...prevLike.filter(
  //               (like) =>
  //                 !(like.user_id === userIDSession && like.post_id === post_id)
  //             ),
  //             data,
  //           ]);
  //           setDislikePost((prevDislike) =>
  //             prevDislike.filter((dislike) => dislike.user_id !== userIDSession)
  //           );
  //         } else if (reaction_type === "dislike") {
  //           // Добавляем дизлайк локально и удаляем возможный лайк
  //           setDislikePost((prevDislike) => [
  //             ...prevDislike.filter(
  //               (dislike) =>
  //                 !(
  //                   dislike.user_id === userIDSession &&
  //                   dislike.post_id === post_id
  //                 )
  //             ),
  //             data,
  //           ]);
  //           setlikePost((prevLike) =>
  //             prevLike.filter((like) => like.user_id !== userIDSession)
  //           );
  //         }
  //       }
  //     }

  //     // После изменений обновляем данные с сервера
  //     fetchReactionsPosts();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // ------------> Логика для создания реакций для постов  <------------
  return (
    <PostContext.Provider
      value={{
        posts,
        inputsPosts,
        inputsPostHandler,
        submitPostsHandler,
        id,
        likePost,
        dislikePost,
        submitPostReaction,
        fetchReactionsPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export { PostContext };
