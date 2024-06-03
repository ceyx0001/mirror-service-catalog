import "dotenv/config";
import createError from "http-errors";
import express from "express";
import helmet from "helmet";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import indexRouter from "./routes/index.js";

const app = express();

// Enable CORS only for localhost:3001
app.use(
  cors({
    origin: "http://localhost:5173",
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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "dev" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

app.get("/api/", (req, res, next) => {
  console.log("query access");
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
import * as catalogSchema from "./db/schemas/catalogSchema.js";
import * as itemsSchema from "./db/schemas/itemsSchema.js";
import * as modsSchema from "./db/schemas/modsSchema.js";
let db;
main().catch((err) => console.log(err));
async function main() {
  const connectionString = process.env.SUPABASE_URL;
  const client = postgres(connectionString, {
    username: `${process.env.SUPABASE_USER}`,
    prepare: false,
  });
  db = drizzle(
    client,
    { schema: { ...catalogSchema, ...itemsSchema, ...modsSchema } },
    { logger: true }
  );
}

export { app, db };
