import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
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
    fetch(`http://localhost:3001/directions`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => setAllDirections(data))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    fetch(`http://localhost:3001/thumbnails`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => setAllThumbnails(data))
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
      </Routes>
    </>
  );
}

export default App;
