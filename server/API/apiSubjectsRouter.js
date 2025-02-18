const express = require("express");
const { Direction, Subject } = require("../db/models");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const findDirectionID = await Direction.findByPk(id);
    const findAllSubjects = await Subject.findAll({
      where: { direction_id: findDirectionID.id },
    });
    res.json(findAllSubjects);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
