import React, { useState } from "react";
import "./signup.css";
import axios from "axios";

export default function Signup({ setUserIDSession, setUserNameSession }) {
  const [inputs, setInputs] = useState({
    login: "",
    password: "",
    name: "",
  });

  const changeHandler = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `${process.env.REACT_APP_BASEURL}/api/users/signup`,
      {
        login: inputs.login,
        password: inputs.password,
        name: inputs.name,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Включаем cookie для сохранения сессии
      }
    );
    if (response.status === 200) {
      const { data } = response;
      setUserIDSession(data.userID);
      setUserNameSession(data.userName);
    }
  };

  return (
    <div className="wrapper__register">
      <div className="blob" />
      <div className="form">
        <form onSubmit={submitHandler}>
          <h2 className="login-title">Регистрация</h2>
          <div className="input-box">
            <span className="icon">
              {" "}
              <ion-icon name="mail-outline" />
            </span>
            <input
              type="text"
              placeholder="...login"
              name="login"
              value={inputs.login}
              onChange={changeHandler}
            />
          </div>
          <div className="input-box">
            <span className="icon">
              <ion-icon name="lock-closed-outline" />
            </span>
            <input
              name="password"
              type="password"
              placeholder="...password"
              value={inputs.password}
              onChange={changeHandler}
            />
          </div>
          <div className="input-box">
            <span className="icon">
              <ion-icon name="lock-closed-outline" />
            </span>
            <input
              type="text"
              placeholder="...name"
              name="name"
              value={inputs.name}
              onChange={changeHandler}
            />
          </div>
          <div className="remember-forgot">
            <label htmlFor="remember">
              <input type="checkbox" id="remember" />
              Запомнить
            </label>
          </div>
          <button type="submit">Войти</button>
        </form>
      </div>
    </div>
  );
}
