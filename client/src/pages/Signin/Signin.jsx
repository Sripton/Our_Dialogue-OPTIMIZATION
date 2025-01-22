import React from "react";
import { NavLink } from "react-router-dom";
import "./signin.css";

export default function Signin() {
  return (
    <div className="wrapper__register">
      <div className="blob" />
      <div className="form">
        <form>
          <h2 className="login-title">Вход</h2>
          <div className="input-box">
            <span className="icon">
              {" "}
              <ion-icon name="mail-outline" />
            </span>
            <input type="text" placeholder="...login" />
          </div>
          <div className="input-box">
            <span className="icon">
              <ion-icon name="lock-closed-outline" />
            </span>
            <input type="password" placeholder="...password" />
          </div>
          <div className="remember-forgot">
            <label htmlFor="remember">
              <input type="checkbox" id="remember" />
              Запомнить
            </label>
            <a href="#">Забыли пароль?</a>
          </div>
          <button type="submit">Войти</button>
          <div className="registration-list">
            <p>Еще не зарегистрированы?</p>
            <NavLink className="registration-link" to="/signup">
              Зарегистрироваться
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}
