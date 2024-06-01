import shop from "./shopController.js";
import threads from "./threadsController.js";
import * as db from "../db/queries.js";
import asyncHandler from "express-async-handler";

export const catalogUpdate = asyncHandler(async (req, res, next) => {
  try {
    const startPage = parseInt(req.query.startPage, 10) || 1;
    const endPage = parseInt(req.query.endPage, 10) || 50;

    const threadReq = { query: { startPage: startPage, endPage: endPage } };
    const serviceThreads = await threads(threadReq);
    // Create a new request object for each thread
    const requests = serviceThreads.map(async (thread) => {
      const shopData = await shop(thread.index);
      return { ...shopData, views: thread.views, title: thread.title };
    });

    // Wait for all shop operations to complete
    const shops = await Promise.all(requests);

    const uniqueShops = new Map();
    shops.map((shop) => {
      if (!uniqueShops.has(shop.profile_name)) {
        uniqueShops.set(shop.profile_name, shop);
      }
    });
    const results = Array.from(uniqueShops.values());

    if (results.length === 0) {
      const err = new Error("No mirror items up for service.");
      err.status = 400;
      throw err;
    }

    await db.updateCatalog(results);
    res.json("complete");
  } catch (error) {
    console.log(error);
  }
});

export const allThreads = asyncHandler(async (req, res, next) => {
  res.json(await db.allThreads());
});

export const someThreads = asyncHandler(async (req, res, next) => {
  const start = req.query.offset - 1 || 0;
  const end = req.query.max;
  res.json(await db.someThreads(start, end));
});

export const someShops = asyncHandler(async (req, res, next) => {
  const start = req.query.offset - 1 || 0;
  const end = req.query.max;
  res.json(await db.someShops(start, end));
});
