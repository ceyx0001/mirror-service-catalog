import shop from "./shopController.js";
import threads from "./threadsController.js";
import * as db from "../db/queries.js";
import asyncHandler from "express-async-handler";

const catalog_update = asyncHandler(async (req, res, next) => {
  const startPage = parseInt(req.query.startPage, 10) || 1;
  const endPage = parseInt(req.query.endPage, 10) || 50;

  const threadReq = { query: { startPage: startPage, endPage: endPage } };
  const newThreads = await threads(threadReq);
  // Create a new request object for each thread
  const requests = newThreads.map(async (threadIndex) => {
    const shopReq = { params: { threadIndex } };
    const shopData = await shop(shopReq);
    return shopData;
  });

  // Wait for all shop operations to complete
  let results = await Promise.all(requests);
  if (results.length === 0) {
    const err = new Error("No mirror items up for service.");
    err.status = 400;
    throw err;
  }

  await db.updateShop(results);
  res.json("Completed");
});

const catalog_details = asyncHandler(async (data) => {});

export { catalog_details, catalog_update };
