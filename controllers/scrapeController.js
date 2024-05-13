const axios = require("axios");
const cheerio = require("cheerio");
const asyncHandler = require("express-async-handler");

exports.scrape = asyncHandler(async (req, res, next) => {
  // fetch one vendor
  const response = await axios.get(
    "https://www.pathofexile.com/forum/view-thread/3401344",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    }
  );

  // clean response into array of JSON objects
  const document = cheerio.load(response.data); // html string
  let items = [];

  document("script").each((i, element) => {
    // find script tag containing deferred item renderer with item info
    const scriptContent = document.html(element);
    if (scriptContent.includes('require(["main"], function() {')) {
      const arrayStartIndex = scriptContent.indexOf("new R(") + 6; // clean string
      const arrayEndIndex = scriptContent.indexOf(".run()") - 2;
      const arrayString = scriptContent.slice(arrayStartIndex, arrayEndIndex);
      items = JSON.parse(arrayString).map((item) => ({
        icon: item[1].icon,
        name: item[1].name,
        enchantMods: item[1].enchantMods,
        implicitMods: item[1].implicitMods,
        explicitMods: item[1].explicitMods,
        fracturedMods: item[1].fracturedMods,
        craftedMods: item[1].craftedMods,
      }));
    }
  });

  res.json(items);
});
