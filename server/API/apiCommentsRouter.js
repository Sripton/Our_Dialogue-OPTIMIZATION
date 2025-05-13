const express = require("express");
const { Post, Comment, User, Commentreaction } = require("../db/models");
const router = express.Router();

// Обработка POST-запроса по маршруту /:id — добавление нового комментария к посту
router.post("/:id", async (req, res) => {
  const { id } = req.params; // Получаем ID поста из параметров URL
  const { commenttitle, parent_id } = req.body; // Получаем текст комментария и ID родительского комментария из тела запроса
  try {
    // Ищем пост в базе данных по ID
    const findPostID = await Post.findByPk(id);
    // Создаём новый комментарий в базе
    const createComments = await Comment.create({
      commenttitle: commenttitle, // Текст комментария
      user_id: req.session.userID, // ID пользователя из сессии
      post_id: findPostID.id, // ID поста, к которому относится комментарий
      parent_id: parent_id || null, // Если это ответ — сохраняем parent_id, иначе null
    });
    // Отправляем созданный комментарий клиенту
    res.json(createComments);
  } catch (error) {
    // Логируем ошибку в консоль, если что-то пошло не так
    console.log(error);
  }
});

// Обработка GET-запроса по маршруту /:id — получение всех комментариев для поста с указанным ID
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Получаем ID поста из параметров URL
  try {
    // Ищем все комментарии в базе данных, у которых post_id совпадает с переданным ID
    const findAllCommentForPostID = await Comment.findAll({
      where: { post_id: id },
      order: [["createdAt", "ASC"]],
      include: [
        { model: User, attributes: ["name"] },
        {
          model: Comment,
          as: "ParentComment",
          include: [{ model: User, attributes: ["name"] }],
        },
        { model: Commentreaction, as: "reactions" },
      ],
    });
    // Отправляем найденные комментарии клиенту
    res.json(findAllCommentForPostID);
  } catch (error) {
    // В случае ошибки выводим её в консоль
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { commenttitle } = req.body;
  try {
    await Comment.update({ commenttitle }, { where: { id } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Commentreaction.destroy({ where: { comment_id: id } });
    await Comment.destroy({ where: { parent_id: id } });
    await Comment.destroy({ where: { id } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
