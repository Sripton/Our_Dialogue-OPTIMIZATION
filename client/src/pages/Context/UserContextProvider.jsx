import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = React.createContext();
export default function UserContextProvider({ children }) {
  // Состояния для хранения информации об ID пользователе из сессии
  const [userIDSession, setUserIDSession] = useState(null);
  // Состояния для хранения информации об name пользователе из сессии
  const [userNameSession, setUserNameSession] = useState(null);

  const navigate = useNavigate();
  const submitSignupHandler = async (e, inputs) => {
    // Предотвращаем перезагрузку страницы
    e.preventDefault();
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

  const submitSigninHandler = async (e, inputs) => {
    // Предотвращаем перезагрузку страницы
    e.preventDefault();
    try {
      const response = await axios.post(`/api/users/signin`, {
        login: inputs.login,
        password: inputs.password,
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

  const logoutHandler = () => {
    axios.get(`/api/users/logout`).then((res) => {
      setUserIDSession(null);
      setUserNameSession(null);
      navigate("/");
    });
  };

  // Запрос на сервер для проверки, авторизован ли пользователь
  useEffect(() => {
    axios
      .get(`/api/users/checkUser`)
      .then((res) => {
        // Если пользователь найден, сохраняем его данные в состояние
        setUserIDSession(res.data.userID);
        setUserNameSession(res.data.userName);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <UserContext.Provider
      value={{
        submitSignupHandler,
        submitSigninHandler,
        logoutHandler,
        userIDSession,
        userNameSession,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export { UserContext };
