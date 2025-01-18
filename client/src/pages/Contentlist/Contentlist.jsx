import React, { useEffect, useState } from "react";
import "./contentlist.css";

export default function Contentlist({ allDirections, allThumbnails }) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(1);
  const [caoruselItems, setCaoruselItems] = useState(allDirections);
  const [thumbnailItems, setThumbnailItems] = useState(allThumbnails);
  // Если allDirections и allThumbnails приходят с сервера асинхронно,
  // то на момент инициализации компонента useState получит значение undefined или пустой массив.
  // console.log("caoruselItems", caoruselItems); // пустой массив
  // console.log("thumbnailItems", thumbnailItems); // пустой массив
  useEffect(() => {
    if (allDirections) setCaoruselItems(allDirections);
    if (allThumbnails) setThumbnailItems(allThumbnails);
  }, [allDirections, allThumbnails]);
  console.log("caoruselItems", caoruselItems); // не пустой массив
  console.log("thumbnailItems", thumbnailItems); //  не пустой массив
  let indexs = 0;
  const handleClickButtonNext = () => {
    const updatedCaoruselItems = [
      ...caoruselItems.slice(indexs + 1),
      caoruselItems[indexs],
    ];
    setCaoruselItems(updatedCaoruselItems);
    const updatedThumbnailItems = [
      ...thumbnailItems.slice(indexs + 1),
      thumbnailItems[indexs],
    ];
    setThumbnailItems(updatedThumbnailItems);
    indexs += 1;
  };

  return (
    <div className={`caorusel ${selectedItemIndex ? "_next" : ""}`}>
      <button type="button" className="carousel-button-prev">
        Назад
      </button>
      <div className="caorusel-list">
        {caoruselItems?.map((direction) => (
          <div className="caorusel-item" key={direction.id}>
            <img
              src={`/directions/${direction.img}`}
              alt={`${direction.title}`}
            />
            <div className="caorusel-content">
              <div className="caorusel-title">{direction.title}</div>
              <div className="caorusel-description">
                {direction.description}
              </div>
              <button type="submit" className="caorusel-button">
                Перейти
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="arrows">
        <button className="next" type="button" onClick={handleClickButtonNext}>
          {">"}
        </button>
      </div>

      <div className="thumbnail-list">
        {thumbnailItems?.map((thumbnail, index) => (
          <div className="thumbnail-item" key={thumbnail.id}>
            <img
              src={`/directions/${thumbnail.img}`}
              alt={`${thumbnail.title}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
