const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const { Direction, Thumbnail } = require("./db/models");
const session = require("express-session");
const session__file__store = require("session-file-store");
const apiUsersRouter = require("./API/apiUsers");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FileStore = session__file__store(session);
const sessionConfig = {
  name: "user_sid-2", // Имя куки для хранения id сессии. По умолчанию - connect.sid
  store: new FileStore(),
  secret: process.env.SESSION_SECRET ?? "dialogoptimization", // Секретное слово для шифрования, может быть любым
  resave: false, // Пересохранять ли куку при каждом запросе
  saveUninitialized: false, // Создавать ли сессию без инициализации ключей в req.session
  cookie: {
    maxAge: 1000 * 60 * 60 * 12, // Срок истечения годности куки в миллисекундах
    httpOnly: true, // Серверная установка и удаление куки, по умолчанию true
    sameSite: "none", // Для разных портов
    secure: false, // Для локальной разработки
  },
};

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(session(sessionConfig));

app.use(async (req, res, next) => {
  try {
    const allDirections = await Direction.findAll();
    const allThumbnail = await Thumbnail.findAll();
    res.locals.allDirections = allDirections;
    res.locals.allThumbnail = allThumbnail;
    res.locals.userID = req.session?.userID;
    res.locals.userName = req.session?.userName;
  } catch (error) {
    console.log(error);
  }
  next();
});

app.get("/directions", async (req, res) => {
  res.json(res.locals.allDirections);
});
app.get("/thumbnails", async (req, res) => {
  res.json(res.locals.allThumbnail);
});
app.get("/userIDSession", async (req, res) => {
  // console.log("Текущая сессия на сервере:", req.session);
  res.json({
    userID: req.session?.userID || null,
  });
});
app.get("/userNameSession", async (req, res) => {
  // console.log("Текущая сессия на сервере:", req.session);
  res.json({
    userName: req.session?.userName || null,
  });
});

app.use("/api/users", apiUsersRouter);
app.listen(PORT, () => console.log(`Server has started on ${PORT} port`));
