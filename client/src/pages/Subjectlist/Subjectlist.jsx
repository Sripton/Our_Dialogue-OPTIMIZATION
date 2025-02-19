import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./subjectslist.css";
import { SubjectsContext } from "../Context/SubjectsContextProvider";

export default function Subjectlist() {
  const {
    subjects,
    handleClickTabs,
    scrollLeft,
    scrollRight,
    leftBtnRef,
    rightBtnRef,
    tabNavListRef,
    canScrollLeft,
    canScrollRight,
    selectedTabId,
  } = useContext(SubjectsContext);
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
