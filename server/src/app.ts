import "dotenv/config";
import createError from "http-errors";
import express from "express";
import helmet from "helmet";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import indexRouter from "./routes/routes";
import { rateLimit } from "express-rate-limit";
const schedule = require("node-schedule");
import { catalogUpdate } from "./controllers/catalogController";

if (process.env.MODE === "development") {
  const job = schedule.scheduleJob("0 0 * * *", function () {
    console.log("Updating catalog...");
    catalogUpdate();
  });
}

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);
app.set("trust proxy", 1);

const timeout = 1 * 5 * 1000;
const window = 1 * 5 * 1000;
app.use(
  rateLimit({
    windowMs: window,
    skipFailedRequests: true,
    limit: 5,
    message: { message: "Rate limit exceeded.", timeout: timeout },
  })
);

app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
});

app.get("/", (req, res) => {
  const { query } = req.query;

  // Check if any query string value is negative
  for (let key in query) {
    if (Number(query[key]) <= 0) {
      return res
        .status(400)
        .send(`Query parameter ${key} has an invalid value: ${query[key]}`);
    }
  }
});

export default app;
