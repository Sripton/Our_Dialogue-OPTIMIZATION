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
  const postLikes = (likePost || []).filter((like) => like.post_id === post.id);
  // Фильтруем массив дизлайков, оставляя только те, которые относятся к текущему посту
  const postDislikes = (dislikePost || []).filter(
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
  // Логика для  изменения и удаления комменатриев
  // ID комментария, который сейчас редактируется
  const [editCommentID, setEditCommentID] = useState("");
  // Текст комментария, который редактируется
  const [editCommentText, setEditCommentText] = useState("");

  // Обработчик кнопки "Редактировать" — подставляет значения текущего комментария в форму
  const handlerEditComments = (comment) => {
    setEditCommentID(comment.id);
    setEditCommentText(comment.commenttitle);
  };

  // Обновляет текст редактируемого комментария при вводе
  const inputsEditCommentsChange = (e) => {
    setEditCommentText(e.target.value);
  };

  // Обрабатывает отправку отредактированного комментария на сервер
  const editCommentsHandler = async (commentID) => {
    await axios
      .put(`/api/comments/${commentID}`, {
        commenttitle: editCommentText,
      })
      .then(() =>
        // Обновляет локальный список комментариев после успешного запроса
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === editCommentID
              ? { ...comment, commenttitle: editCommentText }
              : comment
          )
        )
      );
  };

  const deleteCommentsHandler = async (id) => {
    const response = await axios.delete(`/api/comments/${id}`);
    if (response.status === 200) {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== id)
      );
      await getCommentsAxios();
    }
  };
  // Логика для  изменения и удаления комменатриев
  // ---------------------------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------------------------
  // Логика создания реакций для комменатриев
  // Функция обновления реакций к комментариям

  const updateReactions = (reactions, reaction_type, userID, commentID) => {
    // Проверяем, существует ли уже реакция от этого пользователя
    const existsReactions = reactions.find(
      (reaction) => reaction.user_id === userID
    );
    if (existsReactions) {
      // Если реакция уже есть — обновляем её тип (like/dislike)
      return reactions.map(
        (reaction) =>
          reaction.user_id === userID
            ? { ...reaction, reaction_type } // заменяем тип реакции
            : reaction // остальные реакции оставляем без изменений
      );
    }
    // Если реакции ещё нет — добавляем новую в массив
    return [
      ...reactions,
      { user_id: userID, comment_id: commentID, reaction_type },
    ];
  };

  const submitCommentReactions = async (commentID, reaction_type) => {
    try {
      // Отправляем POST-запрос на сервер с новой реакцией
      const response = await axios.post(`/api/commentreactions/${commentID}`, {
        reaction_type,
      });
      // Если сервер успешно принял реакцию
      if (response.status === 200) {
        // Обновляем локальное состояние комментариев
        setComments((prevComments) =>
          prevComments.map(
            (comment) =>
              comment.id === commentID
                ? {
                    ...comment,
                    // Обновляем массив реакций у конкретного комментария
                    reactions: updateReactions(
                      comment.reactions || [], // если реакций ещё не было — берём пустой массив
                      reaction_type,
                      userIDSession,
                      comment.id
                    ),
                  }
                : comment // остальные комментарии не меняем
          )
        );
      }
    } catch (error) {
      // В случае ошибки — логируем её
      console.log(error);
    }
  };
  // Логика создания реакций для комменатриев
  // ---------------------------------------------------------------------------------------------------

  return (
    <div className={`post-section ${isDotsActive ? "showActions" : ""}`}>
      {/* Кнопка для показа/скрытия комментариев */}
      <button
        type="button"
        className="toggle-posts-btn"
        onClick={showCommentsHandler}
      >
        {`${showComments ? "скрыть" : "Комментарии"} ${comments.length} `}
      </button>
      <div className="post-list">
        <div className="post">
          {/* Если редактирование поста активно — показываем форму, иначе — текст поста */}
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
          {/* Действия для поста: лайк, дизлайк, редактировать, удалить и т.д. */}
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
            {/* Логика для определения какие кнопки должен видеть пользователь.
                  Если пользовтель не является автором поста он видит кнопки reply */}
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
                {/* Логика для определения какие кнопки должен видеть пользователь.
                  Если пользовтель  является автором поста он видит кнопки edit, delete */}
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
            <small className="post-note">
              {`${post?.User?.name} к теме (${post?.Subject?.subjectName})`}
            </small>
            <small className="post-date">
              {`${new Date(Date.parse(post.createdAt)).toLocaleString()}`}
            </small>
          </div>
          {/* Кнопка с тремя точками при уменьшении экрана кнопки (like, dislike, reply, edit, delete) скрываются и появляется эта кнопка.
          При нажатии на нее появляются кнопки  (like, dislike, reply, edit, delete) */}
          <div className="dots" onClick={handleDotsActive}>
            {" "}
            &#x2022;&#x2022;&#x2022;
          </div>
          {/* Кнопка x при нажатии на нее  кнопки  (like, dislike, reply, edit, delete) скрываются */}
          <div className="close-btn" onClick={handleDotsActive}>
            &#10006;
          </div>
          <div className="replies">
            {/* Форма для создания комментариев к постам */}
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
            {/* Комментарии под постом, с редактированием и возможностью ответить
            на комментарий */}
            {comments?.map((comment) => (
              <div
                className={`comments-underpost ${showComments ? "" : "hidden"}`}
                key={comment.id}
              >
                {/* Форма редактирования комментария */}
                {editCommentID === comment.id ? (
                  <form onSubmit={() => editCommentsHandler(comment.id)}>
                    <div id="reply-form-template" className="add-comment">
                      <textarea
                        name="commenttitle"
                        value={editCommentText}
                        onChange={inputsEditCommentsChange}
                        placeholder="Write a reply..."
                      />
                      <button type="submit">Post Comment</button>
                    </div>
                  </form>
                ) : (
                  /* Текст комментария, если не в режиме редактирования */
                  <p className="comment-text">{comment.commenttitle}</p>
                )}
                {/* Лайк/дизлайк/редактирование/удаление/ответ */}
                <div className="comment-actions">
                  <button
                    type="button"
                    className="like-btn"
                    onClick={() => submitCommentReactions(comment.id, "like")}
                  >
                    <ion-icon class="thumbs" name="thumbs-up-outline" />
                    {
                      (comment?.reactions || []).filter(
                        (reaction) =>
                          reaction.comment_id === comment.id &&
                          reaction.reaction_type === "like"
                      ).length
                    }
                  </button>
                  <button
                    type="button"
                    className="dislike-btn"
                    onClick={() =>
                      submitCommentReactions(comment.id, "dislike")
                    }
                  >
                    <ion-icon class="thumbs" name="thumbs-down-outline" />
                    {
                      (comment?.reactions || []).filter(
                        (reaction) =>
                          reaction.comment_id === comment.id &&
                          reaction.reaction_type === "dislike"
                      ).length
                    }
                  </button>
                  {/* Логика для определения какие кнопки должен видеть пользователь.
                  Если пользовтель не является автором комментария он видит кнопки reply */}
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
                      {/* Логика для определения какие кнопки должен видеть пользователь.
                  Если пользовтель  является автором комментария он видит кнопки edit, delete */}
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => handlerEditComments(comment)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => deleteCommentsHandler(comment.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {/* Логика на отображение был комментарий ответом к посту или к комментарию */}
                  {comment?.ParentComment === null ? (
                    <small className="post-note">{`${comment?.User?.name} ответил  (${post?.User?.name})`}</small>
                  ) : (
                    <small className="post-note">{`${comment?.User?.name} ответил  (${comment?.ParentComment?.User?.name})`}</small>
                  )}
                  <small className="comment-date">
                    {`${new Date(
                      Date.parse(comment.createdAt)
                    ).toLocaleString()}`}
                  </small>
                </div>
                {/* Форма для написания ответа к комментарию */}
                {replyToCommentID === comment.id ? (
                  <div className="add-comment-forcomment">
                    <form
                      onSubmit={(e) =>
                        submitCommentsHandler(e, post.id, comment.id)
                      }
                    >
                      <textarea
                        name="commenttitle"
                        value={inputsComments.commenttitle}
                        onChange={inputsCommentsHandler}
                        placeholder="Write a reply..."
                      />
                      <button type="submit">Post Comment</button>
                    </form>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
