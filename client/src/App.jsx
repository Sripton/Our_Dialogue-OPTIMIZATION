import React, { useEffect, useState } from "react";
import { Routes, Route, data } from "react-router-dom";
import axios from "axios";
import Navbar from "./pages/Navbar";
import Contentlist from "./pages/Contentlist";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

function App() {
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

  // Запрос на сервер для получения списка directions при монтировании компонента
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASEURL}/directions`)
      .then((res) => setAllDirections(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Запрос на сервер для получения списка thumbnails при монтировании компонента
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASEURL}/thumbnails`)
      .then((res) => setAllThumbnails(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Состояния для хранения информации о пользователе из сессии
  const [userIDSession, setUserIDSession] = useState({
    userID: null,
  });
  const [userNameSession, setUserNameSession] = useState({
    userName: null,
  });

  // Запрос на сервер для проверки, авторизован ли пользователь
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASEURL}/api/users/checkUser`)
      .then((res) => {
        // Если пользователь найден, сохраняем его данные в состояние
        setUserIDSession(res.data.userID);
        setUserNameSession(res.data.userName);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Navbar userNameSession={userNameSession} />
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
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </>
  );
}

export default App;
