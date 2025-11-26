const express = require("express");
const router = express.Router();
const { User } = require("../db/models");
const bcrypt = require("bcrypt");

// Обработчик POST-запроса на маршрут "/signup" для регистрации пользователя
router.post("/signup", async (req, res) => {
  const { login, password, name } = req.body;
  try {
    // Хэширование пароля:
    // 10 количество раундов хэширования (чем больше, тем сложнее взломать, но это увеличивает время обработки).
    const hashPassword = await bcrypt.hash(password, 10);

    //  Создание пользователя:
    const createUser = await User.create({
      login,
      password: hashPassword,
      name,
    });
    // Сохранение данных в сессии:
    // После успешного создания пользователя его данные сохраняются в объекте сессии:
    req.session.userID = createUser.id;
    req.session.userName = createUser.name;
    //  Ответ клиенту: На клиент возвращается JSON-объект с идентификатором и именем пользователя.
    res.json({
      userID: createUser.id,
      userName: createUser.name,
    });
  } catch (error) {
    console.log(error);
  }
});

// Обработчик POST-запроса на маршрут "/signin" для входа пользователя
router.post("/signin", async (req, res) => {
  // Деструктурируем логин и пароль из тела запроса
  const { login, password } = req.body;

  try {
    // Ищем пользователя в базе данных по логину
    const findUserLogin = await User.findOne({ where: { login } });

    // Если пользователь найден, сравниваем введённый пароль с хэшем в базе данных
    const comparePAssword = await bcrypt.compare(
      password,
      findUserLogin.password
    );

    // Если пароль верный, сохраняем ID и имя пользователя в сессии
    if (comparePAssword) {
      req.session.userID = findUserLogin.id;
      req.session.userName = findUserLogin.name;

      // Отправляем клиенту ID и имя пользователя
      res.json({
        userID: findUserLogin.id,
        userName: findUserLogin.name,
      });
    }
  } catch (error) {
    // Логируем ошибку в консоль, если что-то пошло не так
    console.log(error);
  }
});

// Обработчик GET-запроса на маршрут "/checkUser" для проверки авторизованного пользователя
router.get("/checkUser", (req, res) => {
  // Проверяем, есть ли userID в сессии (то есть, авторизован ли пользователь)
  if (req.session.userID) {
    // Если пользователь авторизован, отправляем его ID и имя
    return res.json({
      userID: req.session.userID,
      userName: req.session.userName,
    });
  }
  // Если пользователь не авторизован, отправляем статус 401 (Unauthorized)
  return res.status(401).json({ message: "Пользователь не авторизован" });
});

router.get("/logout", (req, res) => {
  try {
    // Удаляем текущую сессию пользователя
    req.session.destroy();
    // Очищаем cookie с идентификатором сессии
    res.clearCookie("user_sid_2");
    // Отправляем клиенту статус 200 (ОК), указывая, что выход выполнен успешно
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
