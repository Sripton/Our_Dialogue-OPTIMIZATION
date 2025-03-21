const express = require("express"); // Подключаем Express.js
const morgan = require("morgan"); // Подключаем morgan для логирования HTTP-запросов
const dotenv = require("dotenv"); // Подключаем dotenv для работы с переменными окружения
const { Direction, Thumbnail } = require("./db/models"); // Импортируем модели из базы данных
const session = require("express-session"); // Подключаем express-session для управления сессиями
const FileStore = require("session-file-store")(session); // Используем FileStore для хранения сессий в файлах
const apiUsersRouter = require("./API/apiUsersRouter"); // Импортируем маршруты API для пользователей
const apiSubjectsRouter = require("./API/apiSubjectsRouter");
const apiPostsRouterjs = require("./API/apiPostsRouter");
const apiPostReactionjs = require("./API/apiPostReaction");
const apiCommentsRouterjs = require("./API/apiCommentsRouter");
const cors = require("cors"); // Подключаем CORS для работы с запросами с других доменов

dotenv.config(); // Загружаем переменные окружения из файла .env

const app = express(); // Создаём экземпляр Express-приложения

const PORT = process.env.PORT || 3001; // Устанавливаем порт из переменной окружения или используем 3001

// Настраиваем CORS, чтобы разрешить кросс-доменные запросы с передачей куков
app.use(
  cors({
    credentials: true, // Разрешаем отправку куков в кросс-доменных запросах
    origin: true, // Разрешаем любые источники (можно указать конкретный)
  })
);

app.use(morgan("dev")); // Включаем логирование HTTP-запросов в режиме "dev"
app.use(express.json()); // Подключаем встроенный middleware для обработки JSON-запросов
app.use(express.urlencoded({ extended: true })); // Подключаем middleware для обработки данных формы
app.use(express.static("public")); // Делаем папку "public" доступной для статики (картинки, CSS, JS)

// Настраиваем управление сессиями
app.use(
  session({
    name: "user_sid_2", // Название cookie сессии
    secret: process.env.SESSION_SECRET ?? "test", // Секретный ключ для подписи сессий (из .env или дефолтное "test")
    resave: true, // Принудительное сохранение сессии в хранилище при каждом запросе
    store: new FileStore(), // Хранилище сессий в файлах
    saveUninitialized: false, // Не сохраняем сессию, если она пустая
    cookie: {
      maxAge: 1000 * 60 * 60 * 12, // Время жизни куки (12 часов)
      httpOnly: true, // Делаем куку недоступной для JavaScript (только сервер)
      sameSite: "lax", // Политика sameSite (предотвращает CSRF-атаки)
      secure: false, // Должно быть true в продакшене (только HTTPS)
    },
  })
);

// Middleware для загрузки данных о направлениях (directions) и миниатюрах (thumbnails) в res.locals
app.use(async (req, res, next) => {
  try {
    const allDirections = await Direction.findAll(); // Загружаем все направления из базы данных
    const allThumbnail = await Thumbnail.findAll(); // Загружаем все миниатюры
    res.locals.allDirections = allDirections; // Сохраняем в res.locals, чтобы использовать в других обработчиках
    res.locals.allThumbnail = allThumbnail;
  } catch (error) {
    console.log(error); // Логируем ошибку, если что-то пошло не так
  }
  next(); // Передаём управление следующему middleware
});

// Маршрут для получения всех  (directions)
app.get("/directions", async (req, res) => {
  res.json(res.locals.allDirections); // Отправляем клиенту JSON с данными
});

// Маршрут для получения всех  (thumbnails)
app.get("/thumbnails", async (req, res) => {
  res.json(res.locals.allThumbnail);
});

// Подключаем маршруты API
app.use("/api/users", apiUsersRouter);
app.use("/api/subjects", apiSubjectsRouter);
app.use("/api/posts", apiPostsRouterjs);
app.use("/api/postreactions", apiPostReactionjs);
app.use("/api/comments", apiCommentsRouterjs);

// Запуск сервера по указанному порту
app.listen(PORT, () => console.log(`Server has started on ${PORT} port`));
