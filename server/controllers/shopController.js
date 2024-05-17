import axios from "axios";
import cheerio from "cheerio";
import asyncHandler from "express-async-handler";

const getShopData = asyncHandler(async (req, res, next) => {
  const url = `https://www.pathofexile.com/forum/view-thread/${req.params.threadIndex}`;
  // fetch one vendor
  const response = await axios.get(url, {
    headers: {
      "User-Agent": `Mirror-Catalog/1.0 (${process.env.DEV_EMAIL}) Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3`,
    },
  });

  // clean response into array of JSON objects
  let serviceItems = [];
  const document = cheerio.load(response.data); // html string
  const scriptContent = document("script")
    .last()
    .html()
    .replace(/\s\s+|\n/g, "");

  if (scriptContent.includes("DeferredItemRenderer")) {
    const arrayStartIndex = scriptContent.indexOf("new R(") + 6; // clean string
    const arrayEndIndex = scriptContent.indexOf(".run()") - 2;
    const arrayString = scriptContent.slice(arrayStartIndex, arrayEndIndex);
    serviceItems = JSON.parse(arrayString)
      .map((item) => {
        if (item[1].name != "" && !("duplicated" in item[1])) {
          return {
            icon: item[1].icon,
            name: item[1].name,
            enchantMods: item[1].enchantMods,
            implicitMods: item[1].implicitMods,
            explicitMods: item[1].explicitMods,
            fracturedMods: item[1].fracturedMods,
            craftedMods: item[1].craftedMods,
            crucibleMods: item[1].crucibleMods,
          };
        }
      })
      .filter(Boolean);
  }

  const profileName = document("tr .post_info .posted-by .profile-link")
    .first()
    .text();

  return { prifleName: profileName, url: url, items: serviceItems };
});

const shop = asyncHandler(async (req, res, next) => {
  const data = await getShopData(req);
  if (res) {
    return res.json(data);
  } else {
    return data;
  }
});

export default shop;
