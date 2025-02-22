import React, { useState } from "react";
import "./addposts.css";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";

export default function Addposts() {
  const [inputs, setInputs] = useState({
    posttitle: "",
  });
  const [posts, setPosts] = useState([]);
  const { id } = useParams();

  const inputsPostHandler = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitPostsHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/posts/${id}`, {
        posttitle: inputs.posttitle,
      });
      if (response.status === 200) {
        const { data } = await response;
        setPosts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="post-container">
      <div className="post-content">
        <h1 className="post-title">Добавить пост</h1>
        <div className="post-box">
          <form className="form-post" onSubmit={submitPostsHandler}>
            <textarea
              name="posttitle"
              value={inputs.posttitle || ""}
              onChange={inputsPostHandler}
            />
            <button id="submit-post" type="submit">
              Опубликовать
            </button>
          </form>
        </div>
        <div className="post-info">
          <p>
            Количество постов на данную тему:
            <span id="reply-count">0</span>
          </p>
          {/* Использовать <a /> вместо <NavLink/>. При
            использовании <a/> производительность лучше */}
          <NavLink to="" className="view-comments">
            Перейти к обсуждению
          </NavLink>
        </div>
      </div>
    </div>
  );
}
