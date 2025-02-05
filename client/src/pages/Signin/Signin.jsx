import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signin.css";

export default function Signin({ setUserIDSession, setUserNameSession }) {
  const [inputs, setInputs] = useState({
    login: "",
    password: "",
  });

  const navigate = useNavigate();
  const inputsHandler = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const submitSigninHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/users/signin`, {
        login: inputs.login,
        password: inputs.password,
      });
      if (response.status === 200) {
        const { data } = await response;
        setUserIDSession(data.userID);
        setUserNameSession(data.userName);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
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
