const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { Direction, Thumbnail } = require("./db/models");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const apiUsersRouter = require("./API/apiUsers");
const cors = require("cors");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    name: "user_sid_2",
    secret: process.env.SESSION_SECRET ?? "test",
    resave: true,
    store: new FileStore(),
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 12,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  })
);

app.use(async (req, res, next) => {
  try {
    const allDirections = await Direction.findAll();
    const allThumbnail = await Thumbnail.findAll();
    res.locals.allDirections = allDirections;
    res.locals.allThumbnail = allThumbnail;
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
app.use("/api/users", apiUsersRouter);
app.listen(PORT, () => console.log(`Server has started on ${PORT} port`));
