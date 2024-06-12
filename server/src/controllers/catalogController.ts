import shop from "./shopController";
import { threads } from "./threadsController";
import * as db from "../db/queries";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

export const catalogUpdate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const startPage = parseInt(req.query.startPage, 10) || 1;
      const endPage = parseInt(req.query.endPage, 10) || 50;

      const threadReq = { query: { startPage: startPage, endPage: endPage } };
      const serviceThreads = await threads(threadReq, next);
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
        const err: any = new Error("No mirror items up for service.");
        err.status(400);
        next(err);
      }

      await db.updateCatalog(results);
      res.json("complete");
    } catch (error) {
      console.log(error);
    }
  }
);

export const allThreads = asyncHandler(async (req: Request, res: Response) => {
  res.json(await db.getAllThreads());
});

export const threadsInRange = asyncHandler(
  async (req: Request, res: Response) => {
    const offset = req.query.offset - 1 || 0;
    const limit = req.query.limit || 1;
    res.json(await db.getThreadsInRange(offset, limit));
  }
);

export const shopsInRange = asyncHandler(
  async (req: Request, res: Response) => {
    const offset = req.query.offset - 1 || 0;
    const limit = req.query.limit || 1;
    res.json(await db.getShopsInRange(offset, limit));
  }
);

export const filteredItems = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = {
      titleFilters:
        req.query.title !== undefined
          ? Array.isArray(req.query.title)
            ? req.query.title
            : [req.query.title]
          : undefined,
      modFilters:
        req.query.mod !== undefined
          ? Array.isArray(req.query.mod)
            ? req.query.mod
            : [req.query.mod]
          : undefined,
      baseFilters:
        req.query.base !== undefined
          ? Array.isArray(req.query.base)
            ? req.query.base
            : [req.query.base]
          : undefined,
    };
    res.json(await db.getFilteredItems(filters));
  }
);
