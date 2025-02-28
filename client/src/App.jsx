import React, { useEffect, useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./pages/Navbar";
import Contentlist from "./pages/Contentlist";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Subjectlist from "./pages/Subjectlist";
import SubjectsContextProvider from "./pages/Context/SubjectsContextProvider";
import Addposts from "./pages/Addposts";
import Postslist from "./pages/Postslist";
import PostContextProvider from "./pages/Context/PostContextProvider";

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

  return (
    <>
      <Navbar />
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/subjects/:id"
          element={
            <SubjectsContextProvider>
              <Subjectlist />
            </SubjectsContextProvider>
          }
        />
        <Route
          path="/addposts/:id"
          element={
            <PostContextProvider>
              <Addposts />
            </PostContextProvider>
          }
        />
        <Route
          path="/posts/:id"
          element={
            <PostContextProvider>
              <Postslist />
            </PostContextProvider>
          }
        />
      </Routes>
    </>
  );
}

export default App;
