const asyncHandler = require("express-async-handler");
const shopController = require("./shopController");
const threadsController = require("./threadsController");

exports.catalog = asyncHandler(async (req, res, next) => {
  const startPage = parseInt(req.query.startPage, 10) || 1;
  const endPage = parseInt(req.query.endPage, 10) || 50;

  const threadReq = {
    ...req,
    query: { startPage: startPage, endPage: endPage },
  };
  const threads = await threadsController.getThreadsData(threadReq);
  // Create a new request object for each thread
  const requests = threads.map((threadIndex) => {
    const shopReq = { ...req, params: { threadIndex } };
    return shopController.getShopData(shopReq, res);
  });

  // Wait for all shop operations to complete
  const results = await Promise.all(requests);
  res.json(results);
});
