const express = require("express");
const router = express.Router();
const { Subject, Post } = require("../db/models");

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { posttitle } = req.body;
  try {
    const findSubjectID = await Subject.findByPk(id);
    const createPosts = await Post.create({
      posttitle,
      user_id: req.session.userID,
      subject_id: findSubjectID.id,
    });
    res.json(createPosts);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
