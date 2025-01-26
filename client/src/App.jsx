import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
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
      // Функция всегда true
      const { userAgent } = navigator;
      return /Android|Blackberry|iPhone|iPad|iPod|Opera Mini|IEMobile/gi.test(
        userAgent
      );
    };
    const mobileDevice = isMobile();
    document.body.classList.toggle("_touch", mobileDevice);
    document.body.classList.toggle("_pc", !mobileDevice);
    return () => {
      document.body.classList.remove("_touch", "_pc");
    };
  }, []);

  const [allDirections, setAllDirections] = useState([]);
  const [allThumbnails, setAllThumbnails] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASEURL}/directions`)
      .then((res) => setAllDirections(res.data))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASEURL}/thumbnails`)
      .then((res) => setAllThumbnails(res.data))
      .catch((err) => console.log(err));
  }, []);
  const [userIDSession, setUserIDSession] = useState({
    userID: null,
  });
  const [userNameSession, setUserNameSession] = useState({
    userName: null,
  });

  // useEffect(() => {
  //   const restoreSession = async () => {
  //     const response = await fetch("http://localhost:3001/userIDSession", {
  //       method: "GET",
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setUserIDSession(data.userID);
  //       setUserNameSession(data.userName);
  //       console.log("Восстановление сессии:", data); // Лог для проверки
  //     }
  //   };
  //   restoreSession();
  // }, []);
  console.log("allDirections", allDirections);
  console.log("allThumbnails", allThumbnails);

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
