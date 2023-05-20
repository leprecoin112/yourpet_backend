const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/api/auth/auth-routes");
const newsRouter = require("./routes/api/news/news-routes");
const sponsorsRouter = require("./routes/api/sponsors/sponsors-routes");
const noticeRouter = require("./routes/api/notices/notices-routes");
const userRouter = require("./routes/api/user/user-routes");
const addPetsRouter = require("./routes/api/pets/pets-routers");
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["https://yourpet-nu.vercel.app", "http://localhost:3000"],
  })
);
app.use(express.static("public"));
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth", authRouter);
app.use("/api/news", newsRouter);
app.use("/api/sponsors", sponsorsRouter);
app.use("/api/notices", noticeRouter);
app.use("/api/user", userRouter);
app.use("/api/pets", addPetsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
