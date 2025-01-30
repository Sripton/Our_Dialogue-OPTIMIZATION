import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Используется для навигации между страницами
import "./navbar.css";

// Компонент Navbar — верхняя навигационная панель сайта
export default function Navbar({ userNameSession }) {
  // Состояние для отображения/скрытия подменю "Второй пункт"
  const [isArrowActive, setIsArrowActive] = useState(false);

  // Состояние для отображения/скрытия иконки мобильного меню
  const [isIconActive, setIsIconActive] = useState(false);

  // Функция для переключения состояния подменю "Второй пункт"
  const handleIsArrowActive = () => {
    setIsArrowActive(!isArrowActive);
  };

  // Функция для переключения состояния мобильного меню
  const handleIsIconActive = () => {
    setIsIconActive(!isIconActive);
  };
  return (
    <div className="wrapper">
      <header className="header">
        <div className="header-container">
          <a href="#" className="header-logo" />
          {/* Основное меню */}
          <div className="header-menu menu">
            <div
              className={`menu-icon ${isIconActive ? "_active" : ""}`}
              onClick={handleIsIconActive}
            >
              <span />
            </div>
            {/* Основная навигация */}
            <nav className={`menu-body ${isIconActive ? "_active" : ""} `}>
              <ul className="menu-list">
                <li>
                  <a className="menu-link">Первый пункт</a>
                </li>

                <li className={`${isArrowActive ? "_active" : ""}`}>
                  <a className="menu-link">Второй пункт</a>
                  {/* Стрелка для раскрытия подменю */}
                  <span className="menu-arrow" onClick={handleIsArrowActive} />
                  {/* Подменю */}
                  <ul className="menu-sub-list">
                    <li>
                      <a className="menu-sub-link">1 подпункт 2-го меню</a>
                    </li>
                    <li>
                      <a className="menu-sub-link">2 подпункт 2-го меню</a>
                    </li>
                    <li>
                      <a className="menu-sub-link">2 подпункт 2-го меню</a>
                    </li>
                  </ul>
                </li>
                {/* Пункт меню "Вход" с использованием NavLink для маршрутизации */}
                <li>
                  <NavLink className="menu-link" to="/signin">
                    Вход
                  </NavLink>
                </li>
                <li>
                  <p>{`Hello ${userNameSession}`}</p>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
