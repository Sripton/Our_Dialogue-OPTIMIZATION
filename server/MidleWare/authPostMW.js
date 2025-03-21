const { Post } = require("../db/models");

// Middleware для проверки, является ли текущий пользователь владельцем поста
async function checkUserForPosts(req, res, next) {
  // Получаем ID поста из параметров запроса
  const { id } = req.params;
  // Получаем ID пользователя из сессии
  const userID = req.session.userID;
  try {
    // Ищем пост по его ID в базе данных
    const currentPost = await Post.findByPk(id);

    // Если пост не найден, отправляем 404 (Not Found)
    if (!currentPost) {
      return res.status(404).json({ message: "Пост не найден" });
    }
    // Если пользователь не является владельцем поста, отправляем 403 (Forbidden)
    if (userID !== currentPost.user_id) {
      return res.status(403).json({
        message: "Доступ запрещен: вы не являетесь владельцем этого сообщения",
      });
    }
    // Если все проверки пройдены, передаем управление следующему middleware
    return next();
  } catch (error) {
    // Логируем ошибку и отправляем 500 (Internal Server Error)
    console.log(error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
}
module.exports = checkUserForPosts;
