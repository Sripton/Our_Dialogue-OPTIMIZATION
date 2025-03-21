import axios from "axios";
import React, { use, useContext, useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import { UserContext } from "./UserContextProvider";

const PostContext = React.createContext();

export default function PostContextProvider({ children }) {
  //---------------------------------------------------------------------------------
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
  //---------------------------------------------------------------------------------

  // ------------> Логика для изменения и удаления  постов  <------------
  //--------------------------------------------------------------------
  // Состояние для хранения текста редактируемого поста
  const [editPostText, setEditPostText] = useState({});

  // Функция для отправки отредактированного поста на сервер
  const submitEditPosts = async (e, post_id, PostEditActive) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    try {
      // Отправляем PUT-запрос на сервер для обновления поста
      const response = await axios.put(`/api/posts/${post_id}`, {
        posttitle: editPostText, // Передаем новый заголовок поста
      });
      // Если сервер успешно обновил пост
      if (response.status === 200) {
        // Обновляем состояние постов, заменяя старый заголовок на новый
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === post_id ? { ...post, posttitle: editPostText } : post
          )
        );
      }
      // Закрываем режим редактирования поста
      PostEditActive(false);
    } catch (error) {
      console.log(error); // Логируем ошибку в случае неудачи
    }
  };

  // Функция для удаления поста
  const deletePostHandler = async (id) => {
    try {
      // Отправляем DELETE-запрос на сервер для удаления поста
      await axios
        .delete(`/api/posts/${id}`)
        .then(() =>
          // Обновляем состояние постов, удаляя удаленный пост из списка
          setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id))
        )
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  // ------------> Логика для изменения и удаления  постов  <------------
  //--------------------------------------------------------------------

  //-------------------------------------------------------------------
  // ------------> Логика для создания реакций для постов <------------
  // Состояния для хранения лайков  поста
  const [likePost, setlikePost] = useState([]);
  // Состояния для хранения  дизлайков поста
  const [dislikePost, setDislikePost] = useState([]);
  // Получаем ID текущего пользователя из контекста
  const { userIDSession } = useContext(UserContext);

  //   Функция для получения всех лайков и дизлайков с сервера
  //  Вызывается при монтировании компонента и после обновления реакции
  const fetchReactionsPosts = async () => {
    try {
      // Запрос на получение всех лайков
      const likeReponse = await axios.get(`/api/postreactions/getlikepost`);
      // Запрос на получение всех дизлайков
      const dislikeResponse = await axios.get(
        `/api/postreactions/getdislikepost`
      );
      // Обновляем состояния лайков и дизлайков
      setlikePost(likeReponse.data || []);
      setDislikePost(dislikeResponse.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  //  Функция для обработки реакции на пост (лайк/дизлайк)
  //   @param {number} post_id - ID поста, на который реагируют
  //   @param {string} reaction_type - Тип реакции ('like' или 'dislike')
  const submitPostReaction = async (post_id, reaction_type) => {
    // Проверяем, поставил ли пользователь лайк  к этому посту
    const isLikePost = likePost.some(
      (like) => like.user_id === userIDSession && like.post_id === post_id
    );
    // Проверяем, поставил ли пользователь  дизлайк к этому посту
    const isDislikePost = dislikePost.some(
      (dislike) =>
        dislike.user_id === userIDSession && dislike.post_id === post_id
    );

    try {
      // Если пользователь уже поставил лайк и нажал на лайк снова → удаляем лайк
      if (reaction_type === "like" && isLikePost) {
        // удаляем лайк локально
        setlikePost((prevLike) =>
          prevLike.filter(
            (like) =>
              !(like.user_id === userIDSession && like.post_id === post_id)
          )
        );
        // Отправляем DELETE-запрос на сервер для удаления лайка
        await axios.delete(
          `/api/postreactions/destroypostreaction/${post_id}`,
          { data: { user_id: userIDSession } }
        );
        // Если пользователь уже поставил дизлайк и нажал на дизлайк снова → удаляем дизлайк
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
        // Отправляем DELETE-запрос на сервер для удаления дизлайка
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
        // Если сервер успешно обработал запрос (статус 200)
        if (response.status === 200) {
          const { data } = response;
          if (reaction_type === "like") {
            // Добавляем лайк локально и удаляем возможный дизлайк
            setlikePost((prevLike) => [
              //   фильтрация перед добавлением — это перестраховка от возможных багов.
              // Есть вероятность, что сервер по ошибке вернет дублирующий лайк (например, если клиент дважды кликнет очень быстро).
              // Если вдруг был баг при удалении лайка перед этим, мы гарантируем, что старый лайк пользователя точно уберется перед добавлением нового.
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
            //   фильтрация перед добавлением — это перестраховка от возможных багов.
            // Есть вероятность, что сервер по ошибке вернет дублирующий лайк (например, если клиент дважды кликнет очень быстро).
            // Если вдруг был баг при удалении лайка перед этим, мы гарантируем, что старый лайк пользователя точно уберется перед добавлением нового.
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
  // ------------> Логика для создания реакций для постов  <------------
  //--------------------------------------------------------------------

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
        userIDSession,
        editPostText,
        setEditPostText,
        submitEditPosts,
        deletePostHandler,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export { PostContext };
