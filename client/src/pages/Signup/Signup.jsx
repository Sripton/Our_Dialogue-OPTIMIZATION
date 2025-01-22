import React from "react";
import "./signup.css";

export default function Signup() {
  return (
    <div className="wrapper__register">
      <div className="blob" />
      <div className="form">
        <form>
          <h2 className="login-title">Регистрация</h2>
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
          <div className="input-box">
            <span className="icon">
              <ion-icon name="lock-closed-outline" />
            </span>
            <input type="text" placeholder="...name" />
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
            <a className="registration-link" href="#">
              Зарегистрироваться
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
