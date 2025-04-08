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
    userNameSession,
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

  // Хук состояния для хранения ID комментария, на который сейчас отвечают
  const [replyToCommentID, setReplyToCommentID] = useState(null);

  // Обработчик клика по кнопке "Reply" — устанавливает или сбрасывает ID родительского комментария
  const handleReplyToCommentID = (commentID) => {
    setReplyToCommentID(commentID === replyToCommentID ? null : commentID);
  };

  // Функция для получения всех комментариев к текущему посту
  const getCommentsAxios = async () => {
    try {
      const response = await axios.get(`/api/comments/${post.id}`);
      if (response.status === 200) {
        // Сохраняем полученные комментарии в состоянии
        setComments(response.data);
      }
    } catch (error) {
      // Логируем ошибку, если запрос не удался
      console.log(error);
    }
  };

  // Обработчик отправки комментария (нового или ответа)
  const submitCommentsHandler = async (e, post_id, parentID = null) => {
    // Отменяем поведение формы по умолчанию
    e.preventDefault();
    // Если поле пустое или состоит только из пробелов — сбрасываем поле и ничего не делаем
    if (!inputsComments.commenttitle.trim()) {
      setInputsComments({ commenttitle: "" });
      setReplyToCommentID(null);
      return;
    }
    try {
      // Отправляем POST-запрос на сервер с текстом комментария и ID родительского комментария (если есть)
      const response = await axios.post(`/api/comments/${post_id}`, {
        commenttitle: inputsComments.commenttitle,
        parent_id: parentID,
      });
      if (response.status === 200) {
        // Если всё успешно, добавляем новый комментарий в массив
        const { data } = response;
        // Создаем локальный объект комментария (связанный с тем, на который отвечают)
        const formattedComment = {
          ...data,
          parentID: replyToCommentID,
        };

        if (parentID) {
          // Если это ответ, добавляем его в RepliesComment соответствующего родительского комментария
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === replyToCommentID
                ? {
                    ...comment,
                    RepliesComment: [
                      ...(comment.RepliesComment || []),
                      formattedComment,
                    ],
                  }
                : comment
            )
          );
          setReplyToCommentID(null); // сбрасываем форму ответа
        } else {
          // Если это обычный комментарий (не ответ), просто добавляем его в общий список
          setComments((prevComments) => [...prevComments, formattedComment]);
          setShowReplies(false); // Скрываем ответы
        }
        // После локального обновления заново запрашиваем комментарии с сервера
        await getCommentsAxios();
        setInputsComments({ commenttitle: "" }); // Очищаем текстовое поле комментария
      }
    } catch (error) {
      // Логируем ошибку, если запрос не удался
      console.log(error);
    }
  };

  // Хук useEffect выполняется при монтировании компонента или при изменении post.id
  useEffect(() => {
    // Отправляем GET-запрос на сервер, чтобы получить комментарии к посту
    axios
      .get(`/api/comments/${post.id}`)
      // При успешном ответе сохраняем полученные комментарии в состояние
      .then((response) => setComments(response.data))
      // В случае ошибки выводим её в консоль
      .catch((err) => console.log(err));
  }, [post.id]); // Хук сработает заново, если изменится post.id
  // Логика для создания и получения комментариев
  // ---------------------------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------------------------
  // Логика для кнопки отображения комментариев
  // Состояние, определяющее, отображаются ли комментарии или скрыты
  const [showComments, setShowComments] = useState(false);

  // Функция-обработчик, которая переключает состояние отображения комментариев
  // Если комментарии были скрыты — покажет их, и наоборот
  const showCommentsHandler = () => {
    setShowComments(!showComments);
  };
  // Логика для кнопки отображения комментариев
  // --------------------------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------------------------
  // Логика создания реакций для комменатриев

  // Логика создания реакций для комменатриев
  // ---------------------------------------------------------------------------------------------------

  return (
    <div className={`post-section ${isDotsActive ? "showActions" : ""}`}>
      <button
        type="button"
        className="toggle-posts-btn"
        onClick={showCommentsHandler}
      >
        {`${showComments ? "скрыть" : "Комментарии"} ${comments.length} `}
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

            {userIDSession !== post.user_id ? (
              <button
                type="button"
                className="reply-btn"
                onClick={handleShowReplies}
              >
                Reply
              </button>
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
              <form onSubmit={(e) => submitCommentsHandler(e, post.id)}>
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
              <div
                className={`comments-underpost ${showComments ? "" : "hidden"}`}
                key={comment.id}
              >
                <p className="comment-text">{comment.commenttitle}</p>

                <div className="comment-actions">
                  <button type="button" className="like-btn">
                    <ion-icon class="thumbs" name="thumbs-up-outline" />
                  </button>
                  <button type="button" className="dislike-btn">
                    <ion-icon class="thumbs" name="thumbs-down-outline" />
                  </button>
                  {userIDSession !== comment.user_id ? (
                    <button
                      type="button"
                      className="reply-btn"
                      onClick={() => handleReplyToCommentID(comment.id)}
                    >
                      Reply
                    </button>
                  ) : (
                    <>
                      <button type="button" className="edit-btn">
                        Edit
                      </button>
                      <button type="button" className="delete-btn">
                        Delete
                      </button>
                    </>
                  )}
                  {comment?.ParentComment === null ? (
                    <small className="post-note">{`${comment?.User?.name} ответил  (${post?.User?.name})`}</small>
                  ) : (
                    <small className="post-note">{`${comment?.User?.name} ответил  (${comment?.ParentComment?.User?.name})`}</small>
                  )}

                  {replyToCommentID === comment.id ? (
                    <form
                      onSubmit={(e) =>
                        submitCommentsHandler(e, post.id, comment.id)
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
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
