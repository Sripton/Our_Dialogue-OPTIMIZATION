const express = require("express");
const router = express.Router();
const { Subject, Post, User, Postreaction, Comment } = require("../db/models");
const checkUserForPosts = require("../MidleWare/authPostMW");
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
      include: [
        { model: User, attributes: ["name"] },
        { model: Subject, attributes: ["subjectName"] },
      ],
    });
    // Отправляем найденные записи в формате JSON в ответе
    res.json(findAllPost);
  } catch (error) {
    // В случае ошибки выводим ее в консоль для отладки
    console.log(error);
  }
});

router.put("/:id", checkUserForPosts, async (req, res) => {
  const { id } = req.params; // Извлекаем ID поста из параметров запроса
  const { posttitle } = req.body; // Получаем новое значение заголовка из тела запроса
  try {
    // Обновляем заголовок поста в базе данных
    const editPost = await Post.update({ posttitle }, { where: { id } });
    res.json(editPost); // Отправляем обновленный пост в ответе
  } catch (error) {
    console.log(error); // Логируем ошибку в случае неудачи
  }
});

// Маршрут для удаления поста
router.delete("/:id", checkUserForPosts, async (req, res) => {
  const { id } = req.params; // Извлекаем ID поста из параметров запроса
  try {
    await Comment.destroy({ where: { post_id: id } });
    // Удаляем все реакции на пост перед его удалением (чтобы избежать проблем с внешними ключами)
    await Postreaction.destroy({ where: { post_id: id } });
    // Удаляем сам пост
    await Post.destroy({ where: { id } });
    res.sendStatus(200); // Отправляем статус 200 (успех) в ответ
  } catch (error) {
    console.log(error); // Логируем ошибку в случае неудачи
  }
});
module.exports = router;
