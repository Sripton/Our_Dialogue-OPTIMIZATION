import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import "./subjectslist.css";

export default function Subjectlist() {
  const [subjects, setSubjects] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`/api/subjects/${id}`)
      .then((subject) => setSubjects(subject.data));
  }, []);

  const leftBtnRef = useRef(null);
  const rightBtnRef = useRef(null);
  const tabNavListRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Функция проверяет, можно ли прокручивать список вкладок
  // влево или вправо и обновляет соответствующие состояния
  const updateIconVisibility = () => {
    // Получаем доступ ко всем элементам tab-nav-list
    const tabNavList = tabNavListRef.current;
    if (tabNavList) {
      const scrollLeftValue = Math.ceil(tabNavList.scrollLeft);
      const scrollableWidth = tabNavList.scrollWidth - tabNavList.clientWidth;
      setCanScrollLeft(scrollLeftValue > 0);
      setCanScrollRight(scrollLeftValue < scrollableWidth);
    }
  };

  const scrollLeft = () => {
    // Получаем доступ к спискам вкладок
    const tabNavList = tabNavListRef.current;
    if (tabNavList) {
      // прокручиваем на 150 пикселей влево
      tabNavList.scrollLeft -= 150;
      setTimeout(() => updateIconVisibility(), 50);
    }
  };

  const scrollRight = () => {
    // Получаем доступ к спискам вкладок
    const tabNavList = tabNavListRef.current;
    if (tabNavList) {
      // прокручиваем на 150 пикселей вправo
      tabNavList.scrollLeft += 150;
      setTimeout(() => updateIconVisibility(), 50);
    }
  };

  const [tabIndexOne, setTabIndexOne] = useState(1);
  const [tabIndexSix, setTabIndexSix] = useState(6);
  const [tabIndexTwelve, setTabIndexTwelve] = useState(12);
  const [tabIndexEighteen, setTabIndexeighteen] = useState(18);

  const handleClick = (subjectID) => {
    setTabIndexOne(subjectID);
    setTabIndexSix(subjectID);
    setTabIndexTwelve(subjectID);
    setTabIndexeighteen(subjectID);
  };
  return (
    <section className="main-container">
      <div className="tab-nav-bar">
        <div className="tab-navigation">
          <i
            className={`uil uil-angle-left left-btn ${
              canScrollLeft ? "" : "hidden"
            }`}
            ref={leftBtnRef}
            onClick={scrollLeft}
          />

          <ul className="tab-nav-list" ref={tabNavListRef}>
            {subjects.map((subject) => (
              <li
                className={`tab-nav-item ${
                  tabIndexOne === subject.id ||
                  tabIndexSix === subject.id ||
                  tabIndexTwelve === subject.id ||
                  tabIndexEighteen === subject.id
                    ? "tab-nav-item-active"
                    : ""
                }`}
                key={subject.id}
                onClick={() => handleClick(subject.id)}
              >
                {subject.subjectName}
              </li>
            ))}
          </ul>
          <i
            className={`uil uil-angle-right right-btn ${
              canScrollRight ? "" : "hidden"
            }`}
            ref={rightBtnRef}
            onClick={scrollRight}
          />
        </div>
      </div>
      <div className="tab-content">
        {subjects.map((subject) => (
          <div
            className={`tab ${
              tabIndexOne === subject.id ||
              tabIndexSix === subject.id ||
              tabIndexTwelve === subject.id ||
              tabIndexEighteen === subject.id
                ? "_active-tab"
                : ""
            }`}
            key={subject.id}
          >
            <div className="row">
              <div className="left-column">
                <div className="img-card">
                  <img src={`/subjects/${subject.img}`} alt="card" />
                </div>
              </div>
              <div className="right-column">
                <div className="info">
                  <NavLink to="/">
                    <ion-icon class="info-icon" name="arrow-redo-outline" />
                  </NavLink>

                  <NavLink to="">
                    {" "}
                    <ion-icon
                      class="info-icon"
                      name="chatbubble-ellipses-outline"
                    >
                      {" "}
                    </ion-icon>
                  </NavLink>
                  <NavLink to="/">
                    <ion-icon class="info-icon" name="arrow-undo-outline" />
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
