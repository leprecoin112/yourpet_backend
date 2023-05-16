const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/api/auth-routes");

const userRouter = require('./routes/api/user-routes');

const newsRouter = require('./routes/api/news-routes');

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);
app.use("/api/news", newsRouter);
// app.use("/api/sponsors", sponsorsRouter);

app.get("/api", (req, res) => {
  res.status(200).json({ message: "You are welcome YourPet API" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
