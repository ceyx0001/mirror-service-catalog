import axios from "axios";
import { load } from "cheerio";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const header = {
  headers: {
    "User-Agent": `Mirror-Catalog/1.0 (${process.env.DEV_EMAIL}) Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3`,
  },
};

async function getThreadDocument(index) {
  const threadUrl = `https://www.pathofexile.com/forum/view-thread/${index}`;
  const threadResponse = await axios.get(threadUrl, header);
  return load(threadResponse.data); // html string
}

async function getProfileDocument(profileName) {
  const profileUrl = `https://www.pathofexile.com/character-window/get-characters`;
  const profileResponse = await axios.get(profileUrl, {
    ...header,
    data: {
      accountName: profileName,
      realm: "pc",
    },
  });
  return profileResponse;
}

const getShopData = async (index) => {
  try {
    // clean response into array of JSON objects
    let serviceItems = [];
    const threadDocument = await getThreadDocument(index);
    const scriptContent = threadDocument("script")
      .last()
      .html()
      .replace(/\s\s+|\n/g, "");
    const profileName = threadDocument("tr .post_info .posted-by .profile-link")
      .first()
      .text();
    
    if (scriptContent.includes("DeferredItemRenderer")) {
      const arrayStartIndex = scriptContent.indexOf("new R(") + 6; // clean string
      const arrayEndIndex = scriptContent.indexOf(".run()") - 2;
      const arrayString = scriptContent.slice(arrayStartIndex, arrayEndIndex);
      serviceItems = JSON.parse(arrayString)
        .map((item) => {
          if (
            item[1].name !== "" &&
            !("duplicated" in item[1]) &&
            item[1].rarity !== "Unique" &&
            !item[1].baseType.includes(" Jewel") &&
            !item[1].baseType.includes("Map")
          ) {
            try {
              let itemQuality;
              if (item[1].properties) {
                const qualityArray = item[1].properties.find((property) =>
                  /^Quality.*/.test(property.name)
                );
                if (qualityArray) {
                  itemQuality = qualityArray.values[0][0].replace(/\D/g, "");
                }
              }
              return {
                id: item[1].id,
                icon: item[1].icon,
                name: item[1].name,
                baseType: item[1].baseType,
                quality: itemQuality || null,
                enchantMods: item[1].enchantMods || null,
                implicitMods: item[1].implicitMods || null,
                explicitMods: item[1].explicitMods || null,
                fracturedMods: item[1].fracturedMods || null,
                craftedMods: item[1].craftedMods || null,
                crucibleMods: item[1].crucibleMods || null,
              };
            } catch (error) {
              console.log(error);
              console.log(item[1].properties);
              console.log(index);
            }
          }
        })
        .filter(Boolean);
    }

    return {
      profileName: profileName,
      threadIndex: parseInt(index),
      items: serviceItems,
    };
  } catch (error) {
    console.log(error);
  }
};

async function test() {
  try {
    return await getProfileDocument("username349");
  } catch (error) {
    console.error(error);
  }
}

const shop = asyncHandler(async (req: Request, res: Response) => {
  if (res) {
    const data = await getShopData(req.params.threadIndex);
    return res.json(data);
  } else {
    const data = await getShopData(req);
    return data;
  }
});

export default shop;
