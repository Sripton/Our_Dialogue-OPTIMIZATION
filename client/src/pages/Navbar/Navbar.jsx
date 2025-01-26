import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

export default function Navbar({ userNameSession }) {
  const [isArrowActive, setIsArrowActive] = useState(false);
  const [isIconActive, setIsIconActive] = useState(false);

  const handleIsArrowActive = () => {
    setIsArrowActive(!isArrowActive);
  };
  const handleIsIconActive = () => {
    setIsIconActive(!isIconActive);
  };
  return (
    <div className="wrapper">
      <header className="header">
        <div className="header-container">
          <a href="#" className="header-logo" />
          <div className="header-menu menu">
            <div
              className={`menu-icon ${isIconActive ? "_active" : ""}`}
              onClick={handleIsIconActive}
            >
              <span />
            </div>
            <nav className={`menu-body ${isIconActive ? "_active" : ""} `}>
              <ul className="menu-list">
                <li>
                  <a className="menu-link">Первый пункт</a>
                </li>

                <li className={`${isArrowActive ? "_active" : ""}`}>
                  <a className="menu-link">Второй пункт</a>
                  <span className="menu-arrow" onClick={handleIsArrowActive} />
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
                  <NavLink className="menu-link" to="/signin">
                    Вход
                  </NavLink>
                </li>
                <li>
                  <p>{`Привет ${userNameSession}`}</p>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
