import React, { useContext, useEffect, useState } from "react";
import "./postscard.css";
import axios from "axios";
import { PostContext } from "../Context/PostContextProvider";

export default function Postscard({ post }) {
  // --------------------------------------------------------
  // Логика для кнопки с тремя точками
  // Состояние для управления отображением кнопки с тремя точками
  const [isDotsActive, setIsDotsActive] = useState(false);
  // Функция для переключения состояния отображения меню действий
  const handleDotsActive = () => {
    setIsDotsActive(!isDotsActive);
  };
  // Логика для кнопки с тремя точками
  // --------------------------------------------------------

  //---------------------------------------------------------------------------------------------------
  // Забираем данные из PostContext
  const {
    likePost,
    dislikePost,
    fetchReactionsPosts,
    submitPostReaction,
    userIDSession,
    editPostText,
    setEditPostText,
    submitEditPosts,
    deletePostHandler,
  } = useContext(PostContext);
  // Забираем данные из PostContext
  //---------------------------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------------------------
  // Логика для реакций на посты
  // Фильтруем массив лайков, оставляя только те, которые относятся к текущему посту
  const postLikes = likePost.filter((like) => like.post_id === post.id);
  // Фильтруем массив дизлайков, оставляя только те, которые относятся к текущему посту
  const postDislikes = dislikePost.filter(
    (dislike) => dislike.post_id === post.id
  );
  // Вызываем функцию загрузки реакций при монтировании компонента
  useEffect(() => {
    fetchReactionsPosts();
  }, []); // Пустой массив зависимостей означает, что эффект сработает только один раз при загрузке компонента
  // Логика для реакций на посты
  //---------------------------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------------------------
  // Логика для изменения постов
  // Хук состояния для отслеживания, активен ли режим редактирования поста
  const [isPostEditActive, setIsPostEditActive] = useState(false);

  // Обработчик клика по кнопке редактирования поста
  const handleEditPostsClick = () => {
    // Переключаем состояние режима редактирования (вкл/выкл)
    setIsPostEditActive(!isPostEditActive);
    // Устанавливаем текст поста в поле редактирования
    setEditPostText(post.posttitle);
  };

  // Обработчик изменения текста в поле редактирования поста
  const handleEditPostsText = (e) => {
    // Обновляем состояние с введённым пользователем текстом
    setEditPostText(e.target.value);
  };
  // Логика для изменения постов
  // ---------------------------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------------------------
  // Логика для создания и получения комментариев

  // Хук состояния, отвечает за показ/скрытие ответов на комментарии
  const [showReplies, setShowReplies] = useState(false);

  // Функция переключения видимости ответов
  const handleShowReplies = () => {
    setShowReplies(!showReplies);
  };

  // Хук состояния для хранения значения поля ввода комментария
  const [inputsComments, setInputsComments] = useState({
    commenttitle: "",
  });

  // Обработчик изменения инпута комментария
  const inputsCommentsHandler = (e) => {
    // Обновляем значение в состоянии, опираясь на name инпута
    setInputsComments((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Хук состояния для хранения массива комментариев
  const [comments, setComments] = useState([]);

  // Обработчик отправки комментария
  const submitCommentsHandler = async (e, post_id, showReplies) => {
    e.preventDefault();
    // Если поле пустое или только пробелы — очищаем и ничего не отправляем
    if (!inputsComments.commenttitle.trim()) {
      setInputsComments({ commenttitle: "" });
    }
    try {
      // Отправляем POST-запрос на сервер с текстом комментария
      const response = await axios.post(`/api/comments/${post_id}`, {
        commenttitle: inputsComments.commenttitle,
      });
      if (response.status === 200) {
        // Если всё успешно, добавляем новый комментарий в массив
        const { data } = response;
        const formattedComment = {
          ...data,
        };
        setComments((prevComments) => [...prevComments, formattedComment]);
      }
    } catch (error) {
      // Логируем ошибку, если запрос не удался
      console.log(error);
    }
    showReplies(true);
  };

  // Хук useEffect выполняется при монтировании компонента или при изменении post.id
  useEffect(async () => {
    // Отправляем GET-запрос на сервер, чтобы получить комментарии к посту
    await axios
      .get(`/api/comments/${post.id}`)
      // При успешном ответе сохраняем полученные комментарии в состояние
      .then((response) => setComments(response.data))
      // В случае ошибки выводим её в консоль
      .catch((err) => console.log(err));
  }, [post.id]); // Хук сработает заново, если изменится post.id
  // Логика для создания и получения комментариев
  // ---------------------------------------------------------------------------------------------------

  return (
    <div className={`post-section ${isDotsActive ? "showActions" : ""}`}>
      <button type="button" className="toggle-posts-btn">
        Комментарии
      </button>
      <div className="post-list">
        <div className="post">
          {isPostEditActive ? (
            <form
              className="form-post"
              onSubmit={(e) => submitEditPosts(e, post.id, setIsPostEditActive)}
            >
              <textarea
                name="posttitle"
                value={editPostText}
                onChange={handleEditPostsText}
              />
              <button id="submit-post" type="submit">
                Опубликовать
              </button>
            </form>
          ) : (
            <p className="post-text">{post.posttitle}</p>
          )}

          <div className="post-action">
            <button
              type="button"
              className="like-btn"
              onClick={() => submitPostReaction(post.id, "like")}
            >
              <ion-icon class="thumbs" name="thumbs-up-outline" />
              {postLikes ? postLikes.length : 0}
            </button>
            <button
              type="button"
              className="dislike-btn"
              onClick={() => submitPostReaction(post.id, "dislike")}
            >
              <ion-icon class="thumbs" name="thumbs-down-outline" />
              {postDislikes ? postDislikes.length : 0}
            </button>
            <button
              type="button"
              className="reply-btn"
              onClick={handleShowReplies}
            >
              Reply
            </button>
            {userIDSession !== post.user_id ? (
              ""
            ) : (
              <>
                <button
                  type="button"
                  className="edit-btn"
                  onClick={handleEditPostsClick}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => deletePostHandler(post.id)}
                >
                  Delete
                </button>
              </>
            )}
            <small className="post-note">{`${post?.User?.name} к теме (${post?.Subject?.subjectName})`}</small>
          </div>
          <div className="dots" onClick={handleDotsActive}>
            {" "}
            &#x2022;&#x2022;&#x2022;
          </div>
          <div className="close-btn" onClick={handleDotsActive}>
            &#10006;
          </div>
          <div className="replies">
            {showReplies && (
              <form
                onSubmit={(e) =>
                  submitCommentsHandler(e, post.id, () => showReplies(false))
                }
              >
                <div id="reply-form-template" className="add-comment">
                  <textarea
                    name="commenttitle"
                    value={inputsComments.commenttitle}
                    onChange={inputsCommentsHandler}
                    placeholder="Write a reply..."
                  />
                  <button type="submit">Post Comment</button>
                </div>
              </form>
            )}
            {comments?.map((comment) => (
              <div className="comments-underpost">
                <p key={comment.id}>{comment.commenttitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
