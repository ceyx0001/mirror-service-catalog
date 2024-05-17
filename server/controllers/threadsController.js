import axios from "axios";
import cheerio from "cheerio";
import asyncHandler from "express-async-handler";

const getThreadsData = asyncHandler(async (req, res, next) => {
  req.startPage = parseInt(req.query.startPage, 10) || 1;
  req.endPage = parseInt(req.query.endPage, 10) || 50;
  let threads = [];
  if (req.startPage > req.endPage) {
    const err = new Error(
      "Page number to start indexing threads is greater than the last page."
    );
    err.status = 400;
    throw err;
  }

  const promises = Array.from(
    { length: req.endPage - req.startPage + 1 },
    async (_, i) => {
      const url = `https://www.pathofexile.com/forum/view-forum/standard-trading-shops/page/${
        i + req.startPage
      }`;
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            `Mirror-Catalog/1.0 (${process.env.DEV_EMAIL}) Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3`,
        },
      });

      const document = cheerio.load(response.data);
      const tableContent = document("#view_forum_table")
        .html()
        .replace(/\s\s+|\n/g, "");

      if (tableContent.includes("tbody")) {
        document("a").each((i, elem) => {
          const element = document(elem);
          const text = element.text().toLowerCase();
          if (
            text.includes("mirror") &&
            (text.includes("service") || text.includes("shop"))
          ) {
            threads.push(parseInt(element.attr("href").match(/\d+/g).join("")));
          }
        });
      } else {
        const err = new Error("Could not find threads.");
        err.status = 500;
        throw err;
      }
    }
  );

  await Promise.all(promises);

  if (threads.length === 0) {
    return { message: "No mirror threads found." };
  }

  return threads;
});

const threads = asyncHandler(async (req, res, next) => {
  const data = await getThreadsData(req);
  if (res) {
    return res.json(data);
  } else {
    return data;
  }
});

export default threads;
