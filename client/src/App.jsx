import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./pages/Navbar";
import Contentlist from "./pages/Contentlist";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

function App() {
  const navigate = useNavigate();
  // Функция isMobile  используется для определения того,
  // осуществляется ли доступ к приложению с мобильного устройства.
  useEffect(() => {
    const isMobile = () => {
      // Определяем тип устройства на основе userAgent браузера.
      // Функция всегда true
      const { userAgent } = navigator;
      return /Android|Blackberry|iPhone|iPad|iPod|Opera Mini|IEMobile/gi.test(
        userAgent
      );
    };
    // Проверяем, является ли устройство мобильным
    const mobileDevice = isMobile();
    // Добавляем соответствующий класс в body в зависимости от типа устройства
    document.body.classList.toggle("_touch", mobileDevice);
    document.body.classList.toggle("_pc", !mobileDevice);

    // Очистка при размонтировании компонента: удаление классов
    return () => {
      document.body.classList.remove("_touch", "_pc");
    };
  }, []);

  // Состояния для хранения данных directions и thumbnails
  const [allDirections, setAllDirections] = useState([]);
  const [allThumbnails, setAllThumbnails] = useState([]);
  // Состояния для хранения информации о пользователе из сессии
  const [userIDSession, setUserIDSession] = useState(null);
  const [userNameSession, setUserNameSession] = useState(null);

  // Запрос на сервер для получения списка directions при  монтировании компонента
  useEffect(() => {
    axios
      .get(`/directions`)
      .then((res) => setAllDirections(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Запрос на сервер для получения списка thumbnails при монтировании компонента
  useEffect(() => {
    axios
      .get(`/thumbnails`)
      .then((res) => setAllThumbnails(res.data))
      .catch((err) => console.log(err));
  }, []);

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

  const logoutHandler = async () => {
    const response = await axios.get("/api/users/logout").then(() => {
      setUserIDSession(null);
      setUserNameSession(null);
      navigate("/");
    });
  };

  return (
    <>
      <Navbar
        userIDSession={userIDSession}
        userNameSession={userNameSession}
        logoutHandler={logoutHandler}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Contentlist
              allDirections={allDirections}
              allThumbnails={allThumbnails}
              setAllDirections={setAllDirections}
              setAllThumbnails={setAllThumbnails}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup
              setUserIDSession={setUserIDSession}
              setUserNameSession={setUserNameSession}
            />
          }
        />
        <Route
          path="/signin"
          element={
            <Signin
              setUserIDSession={setUserIDSession}
              setUserNameSession={setUserNameSession}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
