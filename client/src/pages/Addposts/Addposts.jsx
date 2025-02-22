import React, { useState } from "react"; // Импортируем React и хук useState для работы с состоянием компонента
import "./addposts.css";
import { NavLink, useParams } from "react-router-dom"; // Импортируем NavLink для навигации и useParams для получения параметров URL
import axios from "axios"; // Импортируем axios для выполнения HTTP-запросов

// Функциональный компонент для добавления постов
export default function Addposts() {
  // Состояние для хранения значений полей формы
  const [inputs, setInputs] = useState({
    posttitle: "",
  });
  // Состояние для хранения списка постов, полученных от сервера
  const [posts, setPosts] = useState([]);

  // Получаем параметр id из URL
  const { id } = useParams();

  // Функция для обработки изменений в полях ввода формы
  // При изменении значения в текстовом поле обновляем соответствующее свойство в состоянии inputs
  const inputsPostHandler = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Функция для обработки отправки формы
  // Отправляет POST-запрос на сервер для создания нового поста
  const submitPostsHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/posts/${id}`, {
        posttitle: inputs.posttitle,
      });
      if (response.status === 200) {
        const { data } = await response;
        // Обновляем состояние posts данными, полученными от сервера
        setPosts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="post-container">
      <div className="post-content">
        <h1 className="post-title">Добавить пост</h1>
        <div className="post-box">
          {/* Форма для добавления поста. При отправке формы вызывается функция
          submitPostsHandler  */}
          <form className="form-post" onSubmit={submitPostsHandler}>
            {/* Текстовое поле для ввода заголовка поста.
            Значение синхронизировано с состоянием inputs */}
            <textarea
              name="posttitle"
              value={inputs.posttitle || ""}
              onChange={inputsPostHandler}
            />
            {/* Кнопка отправки формы */}
            <button id="submit-post" type="submit">
              Опубликовать
            </button>
          </form>
        </div>
        <div className="post-info">
          {/* Блок для отображения информации о количестве постов */}
          <p>
            Количество постов на данную тему:
            <span id="reply-count">0</span>
          </p>
          {/* Использовать <a /> вместо <NavLink/>. При
            использовании <a/> производительность лучше */}
          <NavLink to="" className="view-comments">
            Перейти к обсуждению
          </NavLink>
        </div>
      </div>
    </div>
  );
}
