import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import "./signin.css";
import { UserContext } from "../Context/UserContextProvider";

export default function Signin() {
  const { submitSigninHandler } = useContext(UserContext);
  const [inputs, setInputs] = useState({
    login: "",
    password: "",
  });

  const inputsHandler = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="wrapper__register">
      <div className="blob" />
      <div className="form">
        <form onSubmit={(e) => submitSigninHandler(e, inputs)}>
          <h2 className="login-title">Вход</h2>
          <div className="input-box">
            <span className="icon">
              {" "}
              <ion-icon name="mail-outline" />
            </span>
            <input
              type="text"
              name="login"
              value={inputs.login}
              onChange={inputsHandler}
              placeholder="...login"
            />
          </div>
          <div className="input-box">
            <span className="icon">
              <ion-icon name="lock-closed-outline" />
            </span>
            <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={inputsHandler}
              placeholder="...password"
              autoComplete="current-password"
            />
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
