const express = require("express");
const { Comment, Commentreaction } = require("../db/models");
const router = express.Router();
router.post(`/:id`, async (req, res) => {
  const { id } = req.params;
  const { reaction_type } = req.body;
  try {
    const findCommentID = await Comment.findByPk(id);

    const userID = req.session.userID;
    // Проверка, существует ли комментарий  с данным ID
    if (!findCommentID) {
      res.status(404).json({ message: "Комментарий не найден" });
    }

    // // Проверка, оставлял ли пользователь уже реакцию на этот пост
    const existingCommentReaction = await Commentreaction.findOne({
      where: {
        user_id: userID,
        comment_id: findCommentID.id,
      },
    });

    if (existingCommentReaction) {
      // Если реакция уже существует, обновляем её
      existingCommentReaction.reaction_type = reaction_type;
      await existingCommentReaction.save();
      return res.status(200).json(existingCommentReaction);
    }
    // Если реакции нет, создаем новую
    const createCommentReaction = await Commentreaction.create({
      user_id: userID,
      comment_id: findCommentID.id,
      reaction_type: reaction_type,
    });
    res.status(200).json(createCommentReaction);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const com = await Comment.findByPk(id);
  const all = await Commentreaction.findAll({ where: { comment_id: com.id } });
  res.json(all);
});
module.exports = router;
