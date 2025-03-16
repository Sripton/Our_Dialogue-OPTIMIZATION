const express = require("express");
const { Post, Postreaction } = require("../db/models");
const router = express.Router();

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { reaction_type } = req.body;
  try {
    // Находим пост по его ID
    const findPostID = await Post.findByPk(id);

    // Проверка, оставлял ли пользователь уже реакцию на этот пост
    const existingPostReaction = await Postreaction.findOne({
      where: {
        user_id: req.session.userID,
        post_id: findPostID.id,
      },
    });
    if (existingPostReaction) {
      // Если реакция уже существует, обновляем её
      existingPostReaction.reaction_type = reaction_type;
      await existingPostReaction.save();
      return res.status(200).json(existingPostReaction);
    }
    // Если реакции нет, создаем новую
    const createPostReaction = await Postreaction.create({
      user_id: req.session.userID,
      post_id: findPostID.id,
      reaction_type: reaction_type,
    });
    res.json(createPostReaction);
  } catch (error) {
    console.log(error); // Логируем ошибку
  }
});

// Маршрут для получения всех лайков для всех постов
router.get("/getlikepost", async (req, res) => {
  try {
    // Ищем все записи в таблице `Postreaction`, у которых `reaction_type` = "like"
    const findAllPostReactionLike = await Postreaction.findAll({
      where: { reaction_type: "like" }, // Фильтр: выбираем только лайки
    });

    // Отправляем найденные лайки клиенту в формате JSON
    res.json(findAllPostReactionLike);
  } catch (error) {
    // Логируем ошибку, если запрос не удался
    console.log(error);
  }
});

// Маршрут для получения всех дизлайков для всех постов
router.get("/getdislikepost", async (req, res) => {
  try {
    // Ищем все записи в таблице `Postreaction`, у которых `reaction_type` = "dislike"
    const findAllPostReactionDislike = await Postreaction.findAll({
      where: { reaction_type: "dislike" }, // Фильтр: выбираем только дизлайки
    });

    // Отправляем найденные дизлайки клиенту в формате JSON
    res.json(findAllPostReactionDislike);
  } catch (error) {
    // Логируем ошибку, если запрос не удался
    console.log(error);
  }
});

// Удаление всех реакций на конкретный пост
router.delete("/destroypostreaction/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Post.destroy({ where: { id } });
    res.sendStatus(200); // Отправляем успешный статус
  } catch (error) {
    console.log(error); // Логируем ошибку
  }
});
module.exports = router;
