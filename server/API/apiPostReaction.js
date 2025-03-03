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

router.get("/getlikepost", async (req, res) => {
  try {
    const findAllPostReactionLike = await Postreaction.findAll({
      where: { reaction_type: "like" },
    });
    res.json(findAllPostReactionLike);
  } catch (error) {
    console.log(error);
  }
});
router.get("/getdislikepost", async (req, res) => {
  try {
    const findAllPostReactionDislike = await Postreaction.findAll({
      where: { reaction_type: "dislike" },
    });
    res.json(findAllPostReactionDislike);
  } catch (error) {
    console.log(error);
  }
});

// Получение всех лайков для конкретного поста
// router.get("/getlikepost/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     // Находим пост по ID
//     const findPostID = await Post.findByPk(id);
//     // Находим все реакции типа "like" для данного поста
//     const findAllPostReactionLike = await Postreaction.findAll({
//       where: { post_id: findPostID.id, reaction_type: "like" },
//     });
//     res.json(findAllPostReactionLike);
//   } catch (error) {
//     console.log(error); // Логируем ошибку
//   }
// });

// // Получение всех дизлайков для конкретного поста
// router.get("/getdislikepost/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     // Находим пост по ID
//     const findPostID = await Post.findByPk(id);
//     // Находим все реакции типа "dislike" для данного поста
//     const findAllPostReactionDislike = await Postreaction.findAll({
//       where: {
//         post_id: findPostID.id,
//         reaction_type: "dislike",
//       },
//     });
//     res.json(findAllPostReactionDislike);
//   } catch (error) {
//     console.log(error); // Логируем ошибку
//   }
// });

// Удаление всех реакций на конкретный пост
router.delete("/destroypostreaction/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Postreaction.destroy({ where: { post_id: id } });
    res.sendStatus(200); // Отправляем успешный статус
  } catch (error) {
    console.log(error); // Логируем ошибку
  }
});
module.exports = router;
