import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./contentlist.css";
import { UserContext } from "../Context/UserContextProvider";

// Компонент Contentlist отображает карусель directions и thumbnails
export default function Contentlist({
  allDirections, // Массив с данными о directions
  allThumbnails, // Массив с данными thumbnails
  setAllDirections, // Функция для обновления directions
  setAllThumbnails, // Функция для обновления thumbnails
}) {
  // Функция обработки клика по кнопке "Вперёд"
  const handleClickButtonNext = () => {
    setAllDirections([...allDirections.slice(1), allDirections[0]]);
    setAllThumbnails([...allThumbnails.slice(1), allThumbnails[0]]);
  };

  // Функция обработки клика по кнопке "Назад"
  const handleClickButtonPrev = () => {
    setAllDirections([
      allDirections[allDirections.length - 1],
      ...allDirections.slice(0, -1),
    ]);
    setAllThumbnails([
      allThumbnails[allThumbnails.length - 1],
      ...allThumbnails.slice(0, -1),
    ]);
  };
  //---------------------------------------------------------------------------------------------------
  // Забираем данные из UserContext
  const { userIDSession } = useContext(UserContext);
  // Забираем данные из UserContext
  //---------------------------------------------------------------------------------------------------

  return (
    <div className="caorusel _next">
      <button type="button" className="carousel-button-prev">
        Назад
      </button>

      {/* Основной список вdirections */}
      <div className="caorusel-list">
        {allDirections?.map((direction) => (
          <div className="caorusel-item" key={direction.id}>
            <img
              src={`/directions/${direction.img}`}
              alt={`${direction.title}`}
            />
            <div className="caorusel-content">
              <div className="caorusel-title">{direction.title}</div>
              {!userIDSession ? (
                <NavLink to="/signin" className="caorusel-button">
                  Перейти
                </NavLink>
              ) : (
                <NavLink
                  to={`/subjects/${direction.id}`}
                  className="caorusel-button"
                >
                  Перейти
                </NavLink>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Кнопки переключения направлений */}
      <div className="arrows">
        <button className="prev" type="button" onClick={handleClickButtonPrev}>
          {"<"}
        </button>
        <button className="next" type="button" onClick={handleClickButtonNext}>
          {">"}
        </button>
      </div>
      {/* Список thumbnails направлений */}
      <div className="thumbnail-list">
        {allThumbnails?.map((thumbnail) => (
          <div className="thumbnail-item" key={thumbnail.id}>
            <img
              src={`/directions/${thumbnail.img}`}
              alt={`${thumbnail.title}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
