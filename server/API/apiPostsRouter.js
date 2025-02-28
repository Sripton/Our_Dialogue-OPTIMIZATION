const express = require("express");
const router = express.Router();
const { Subject, Post, User } = require("../db/models");

router.post("/:id", async (req, res) => {
  // Извлекаем параметр id из URL запроса
  const { id } = req.params;
  // Извлекаем поле posttitle из тела запроса
  const { posttitle } = req.body;
  try {
    // Ищем объект Subject по его первичному ключу (id)
    const findSubjectID = await Subject.findByPk(id);
    // Создаем новый пост, используя данные из запроса:
    // - posttitle: заголовок поста из тела запроса
    // - user_id: идентификатор пользователя, полученный из сессии
    // - subject_id: идентификатор найденного предмета (Subject)
    const createPosts = await Post.create({
      posttitle,
      user_id: req.session.userID,
      subject_id: findSubjectID.id,
    });
    // Отправляем созданный пост обратно клиенту в формате JSON
    res.json(createPosts);
  } catch (error) {
    // В случае ошибки выводим ее в консоль для отладки
    console.log(error);
  }
});

// Извлекаем параметр id из объекта запроса
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Выполняем поиск всех записей в модели Post, где subject_id равен полученному id
    const findAllPost = await Post.findAll({
      where: { subject_id: id },
      include: [{ model: User }, { model: Subject }],
    });
    // Отправляем найденные записи в формате JSON в ответе
    res.json(findAllPost);
  } catch (error) {
    // В случае ошибки выводим ее в консоль для отладки
    console.log(error);
  }
});



module.exports = router;
