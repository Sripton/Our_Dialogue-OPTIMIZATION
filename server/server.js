const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const { Direction, Thumbnail } = require("./db/models");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(async (req, res, next) => {
  const allDirections = await Direction.findAll();
  const allThumbnail = await Thumbnail.findAll();
  res.locals.allDirections = allDirections;
  res.locals.allThumbnail = allThumbnail;
  next();
});

app.get("/directions", async (req, res) => {
  res.send(res.locals.allDirections);
});
app.get("/thumbnails", async (req, res) => {
  res.send(res.locals.allThumbnail);
});

app.listen(PORT, () => console.log(`Server has started on ${PORT} port`));
