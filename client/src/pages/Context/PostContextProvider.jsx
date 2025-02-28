import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  // ------------> Логика для создания реакций для постов  <------------
  return (
    <PostContext.Provider
      value={{
        posts,
        inputsPosts,
        inputsPostHandler,
        submitPostsHandler,
        id,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export { PostContext };
