import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import "./subjectslist.css";

export default function Subjectlist() {
  // Состояние для хранения списка предметов
  const [subjects, setSubjects] = useState([]);

  // Получаем параметр id из URL
  const { id } = useParams();

  // Храним ID активного таба
  const [selectedTabId, setSelectedTabId] = useState(null);

  // Загружаем список предметов при изменении id
  useEffect(() => {
    axios.get(`/api/subjects/${id}`).then((response) => {
      // Обновляем состояние с полученными данными
      setSubjects(response.data);
      if (response.data.length > 0) {
        // Устанавливаем первый элемент активным по умолчанию
        setSelectedTabId(response.data[0].id);
      }
    });
  }, [id]);

  // Функция для изменения активного таба при клике
  const handleClickTabs = (subjectID) => {
    setSelectedTabId(subjectID);
  };

  const leftBtnRef = useRef(null); // Реф для левой кнопки прокрутки
  const rightBtnRef = useRef(null); // Реф для правой кнопки прокрутки
  const tabNavListRef = useRef(null); // Реф для контейнера вкладок
  // Отслеживает, можно ли прокрутить влево
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  // Отслеживает, можно ли прокрутить вправо
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Функция проверяет, можно ли прокручивать список вкладок
  // влево или вправо и обновляет соответствующие состояния
  const updateIconVisibility = () => {
    // Получаем доступ ко всем элементам tab-nav-list
    const tabNavList = tabNavListRef.current;
    if (tabNavList) {
      const scrollLeftValue = Math.ceil(tabNavList.scrollLeft);
      const scrollableWidth = tabNavList.scrollWidth - tabNavList.clientWidth;
      setCanScrollLeft(scrollLeftValue > 0); // Можно ли прокручивать влево
      setCanScrollRight(scrollLeftValue < scrollableWidth); // Можно ли прокручивать вправо
    }
  };

  // Прокрутка списка вкладок влево
  const scrollLeft = () => {
    // Получаем доступ к спискам вкладок
    const tabNavList = tabNavListRef.current;
    if (tabNavList) {
      // прокручиваем на 150 пикселей влево
      tabNavList.scrollLeft -= 150;

      // Проверяем видимость кнопок после прокрутки
      setTimeout(() => updateIconVisibility(), 50);
    }
  };

  const scrollRight = () => {
    // Получаем доступ к спискам вкладок
    const tabNavList = tabNavListRef.current;
    if (tabNavList) {
      // прокручиваем на 150 пикселей вправo
      tabNavList.scrollLeft += 150;
      // Проверяем видимость кнопок после прокрутки
      setTimeout(() => updateIconVisibility(), 50);
    }
  };

  return (
    <section className="main-container">
      <div className="tab-nav-bar">
        <div className="tab-navigation">
          {/* Левая кнопка прокрутки */}
          <i
            className={`uil uil-angle-left left-btn ${
              canScrollLeft ? "" : "hidden"
            }`}
            ref={leftBtnRef}
            onClick={scrollLeft}
          />
          {/* Навигация по вкладкам */}
          <ul className="tab-nav-list" ref={tabNavListRef}>
            {subjects.map((subject) => (
              <li
                className={`tab-nav-item ${
                  selectedTabId === subject.id ? "tab-nav-item-active" : ""
                }`}
                key={subject.id}
                onClick={() => handleClickTabs(subject.id)}
              >
                {subject.subjectName}
              </li>
            ))}
          </ul>
          {/* Правая кнопка прокрутки */}
          <i
            className={`uil uil-angle-right right-btn ${
              canScrollRight ? "" : "hidden"
            }`}
            ref={rightBtnRef}
            onClick={scrollRight}
          />
        </div>
      </div>
      {/* Контент активной вкладки */}
      <div className="tab-content">
        {subjects.map((subject) => (
          <div
            className={`tab ${
              selectedTabId === subject.id ? "_active-tab" : ""
            }`}
            key={subject.id}
          >
            <div className="row">
              <div className="left-column">
                <div className="img-card">
                  <img src={`/subjects/${subject.img}`} alt="card" />
                </div>
              </div>
              {/* Правая колонка с иконками */}
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
