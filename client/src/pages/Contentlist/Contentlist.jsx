import React, { useEffect, useState } from "react";
import "./contentlist.css";

export default function Contentlist({
  allDirections,
  allThumbnails,
  setAllDirections,
  setAllThumbnails,
}) {
  let indexs = 0;
  const handleClickButtonNext = () => {
    const updatedCaoruselItems = [
      ...allDirections.slice(indexs + 1),
      allDirections[indexs],
    ];
    setAllDirections(updatedCaoruselItems);
    const updatedThumbnailItems = [
      ...allThumbnails.slice(indexs + 1),
      allThumbnails[indexs],
    ];
    setAllThumbnails(updatedThumbnailItems);
    indexs += 1;
  };

  return (
    <div className="caorusel _next">
      <button type="button" className="carousel-button-prev">
        Назад
      </button>
      <div className="caorusel-list">
        {allDirections?.map((direction) => (
          <div className="caorusel-item" key={direction.id}>
            <img
              src={`/directions/${direction.img}`}
              alt={`${direction.title}`}
            />
            <div className="caorusel-content">
              <div className="caorusel-title">{direction.title}</div>
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
        {allThumbnails?.map((thumbnail, index) => (
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
