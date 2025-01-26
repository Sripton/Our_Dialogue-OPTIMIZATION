const express = require("express");
const router = express.Router();
const { User } = require("../db/models");
const bcrypt = require("bcrypt");

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
    console.log("Сессия после установки:", req.session);
    req.session.save((err) => {
      if (err) {
        console.log("Ошибка при сохранении сессии:", err);
      } else {
        console.log("Сессия успешно сохранена:", req.session);
      }
    });
    //  Ответ клиенту: На клиент возвращается JSON-объект с идентификатором и именем пользователя.
    res.json({
      userID: createUser.id,
      userName: createUser.name,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
