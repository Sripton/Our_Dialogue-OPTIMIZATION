import React, { useContext } from "react";
import "./addposts.css";
import { NavLink } from "react-router-dom"; // Импортируем NavLink для навигации
import { PostContext } from "../Context/PostContextProvider";
// Функциональный компонент для добавления постов
export default function Addposts() {
  //---------------------------------------------------------------------------------------------------
  // Забираем данные из PostContext
  const { inputsPosts, inputsPostHandler, submitPostsHandler, id } =
    useContext(PostContext);
  // Забираем данные из PostContext
  //---------------------------------------------------------------------------------------------------
  console.log("item");
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
              value={inputsPosts.posttitle || ""}
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
          <NavLink to={`/posts/${id}`} className="view-comments">
            Перейти к обсуждению
          </NavLink>
        </div>
      </div>
    </div>
  );
}
