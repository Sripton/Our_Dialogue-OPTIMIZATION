import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom"; // Используется для навигации между страницами
import "./navbar.css";
import { UserContext } from "../Context/UserContextProvider";

// Компонент Navbar — верхняя навигационная панель сайта
export default function Navbar() {
  const { userIDSession, userNameSession, logoutHandler } =
    useContext(UserContext);
  // Состояние для отображения/скрытия подменю "Второй пункт"
  const [isArrowActive, setIsArrowActive] = useState(false);
  // Функция для переключения состояния подменю "Второй пункт"
  const handleIsArrowActive = () => {
    setIsArrowActive(!isArrowActive);
  };
  // Состояние для отображения/скрытия иконки мобильного меню
  const [isIconActive, setIsIconActive] = useState(false);

  // Функция для переключения состояния мобильного меню
  const handleIsIconActive = () => {
    setIsIconActive(!isIconActive);
  };

  // Состояние, определяющее, активно ли выпадающее меню профиля
  const [profileDropActive, setProfileDropActive] = useState(false);
  // Реф для кнопки, открывающей выпадающее меню профиля
  const profileDropDownBtn = useRef(null);

  // Функция для переключения состояния выпадающего меню профиля
  const handleProfileDropDown = () => {
    setProfileDropActive(!profileDropActive);
  };

  useEffect(() => {
    // Функция для закрытия выпадающего меню при клике вне него
    const handleClickOutside = (e) => {
      // Если кнопка меню (profileDropDownBtn) отсутствует или клик был внутри неё, ничего не делаем
      if (
        !profileDropDownBtn.current ||
        profileDropDownBtn.current.contains(e.target)
      ) {
        return;
      }
      // Если клик был вне меню, закрываем его
      setProfileDropActive(false);
    };
    // Добавляем обработчик события клика по странице
    window.addEventListener("mousedown", handleClickOutside);

    // При размонтировании компонента или изменении profileDropActive удаляем обработчик
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return !userIDSession ? (
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
                <li />
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </div>
  ) : (
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
                <li>
                  <div className="profile-dropdown">
                    <div
                      className="profile-dropdown-btn"
                      ref={profileDropDownBtn}
                    >
                      <div className="profile-img">
                        <i className="fa-solid fa-circle" />
                      </div>
                      <span>{userNameSession}</span>
                      <span
                        onClick={handleProfileDropDown}
                        className={`direction ${
                          profileDropActive ? "_active-direction" : ""
                        }`}
                      />
                    </div>
                    <ul
                      className={`profile-dropdown-list ${
                        profileDropActive ? "_active-dropmenu" : ""
                      } `}
                    >
                      <li className="profile-dropdown-item">
                        <a href="#">
                          <i className="fa-regular fa-user"> </i>
                          Изменить профиль
                        </a>
                      </li>
                      <li className="profile-dropdown-item">
                        <a href="#">
                          <i className="fa-regular fa-envelope"> </i>
                          Ответили
                        </a>
                      </li>
                      <li className="profile-dropdown-item">
                        <a href="#">
                          <i className="fa-regular fa-heart"> </i>
                          Понравилось
                        </a>
                      </li>
                      <li
                        className="profile-dropdown-item"
                        onClick={logoutHandler}
                      >
                        <NavLink onClick={logoutHandler}>
                          <i className="fa-solid fa-arrow-right-from-bracket">
                            {" "}
                          </i>
                          Выход
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
