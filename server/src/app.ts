import "dotenv/config";
import createError from "http-errors";
import express from "express";
import helmet from "helmet";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import indexRouter from "./routes/index";
import { rateLimit } from "express-rate-limit";

const app = express();

// Enable CORS only for localhost:3001
app.use(
  cors({
    origin: "",
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

app.get("/api/", (req, res) => {
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

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as catalogSchema from "./db/schemas/catalogSchema";
import * as itemsSchema from "./db/schemas/itemsSchema";
import * as modsSchema from "./db/schemas/modsSchema";
let db;
main().catch((err) => console.log(err));
async function main() {
  const connectionString = process.env.SUPABASE_URL;
  const client = postgres(connectionString, {
    username: `${process.env.SUPABASE_USER}`,
    prepare: false,
  });
  db = drizzle(client, {
    schema: { ...catalogSchema, ...itemsSchema, ...modsSchema },
  });
}

export { app, db };
