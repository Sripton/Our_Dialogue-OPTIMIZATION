import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import axios from "axios";

export default function Signup({ setUserIDSession, setUserNameSession }) {
  // Состояние для хранения введённых пользователем данных
  const [inputs, setInputs] = useState({
    login: "",
    password: "",
    name: "",
  });

  // Хук для навигации после успешной регистрации
  const navigate = useNavigate();

  // Функция для обработки изменения полей ввода
  const changeHandler = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Функция для обработки отправки формы регистрации
  const submitHandler = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    // Отправляем POST-запрос на сервер с данными пользователя
    const response = await axios.post(
      `${process.env.REACT_APP_BASEURL}/api/users/signup`,
      {
        login: inputs.login,
        password: inputs.password,
        name: inputs.name,
      },
      {
        withCredentials: true, // Включаем cookie для сохранения сессии
      }
    );

    // Если запрос выполнен успешно, обновляем данные сессии
    if (response.status === 200) {
      const { data } = response;
      setUserIDSession(data.userID);
      setUserNameSession(data.userName);
      navigate("/"); // Перенаправляем пользователя на главную страницу
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
