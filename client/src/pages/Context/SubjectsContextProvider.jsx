import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const SubjectsContext = React.createContext();
export default function SubjectsContextProvider({ children }) {
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
    <SubjectsContext.Provider
      value={{
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
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}

export { SubjectsContext };
