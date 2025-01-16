import React, { useEffect } from "react";
import Navbar from "./pages/Navbar";
import Contentlist from "./pages/Contentlist";

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

  return (
    <>
      <Navbar />
      <Contentlist />
    </>
  );
}

export default App;
