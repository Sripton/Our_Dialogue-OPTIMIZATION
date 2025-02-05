import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import axios from "axios";

export default function Signup({ setUserIDSession, setUserNameSession }) {
  // const { submitSignupHandler } = useContext(UserContext);
  // Состояние для хранения введённых пользователем данных
  const [inputs, setInputs] = useState({
    login: "",
    password: "",
    name: "",
  });

  const navigate = useNavigate();
  // Функция для обработки изменения полей ввода
  const changeSignupHandler = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const submitSignupHandler = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    try {
      // Отправляем POST-запрос на сервер с данными пользователя
      const response = await axios.post(`/api/users/signup`, {
        login: inputs.login,
        password: inputs.password,
        name: inputs.name,
      });
      if (response.status === 200) {
        // Если запрос выполнен успешно, обновляем данные сессии
        const { data } = await response;
        setUserIDSession(data.userID);
        setUserNameSession(data.userName);
        // Перенаправляем пользователя на главную страницу
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
        <form onSubmit={(e) => submitSignupHandler(e, inputs)}>
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
              onChange={changeSignupHandler}
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
              onChange={changeSignupHandler}
              autoComplete="new-password"
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
              onChange={changeSignupHandler}
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
