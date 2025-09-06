/* let a = {
    "Flex Shorthand": {
        "url": "../extends/playgrounds/flexShorthand.html"
    },
    "Aspect Ratio": {
        "url": "../extends/playgrounds/aspectRatio.html"
    }
} */

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const { log } = require("console");

const files = fs.readdirSync("./extends/playgrounds");

const title = [];
const urls = [];

files.forEach((file, i) => {
  const filePath = path.join("./extends/playgrounds", file);
  const html = fs.readFileSync(filePath, "utf8");
  const dom = new JSDOM(html);
  title.push(dom.window.document.querySelector("title").textContent);
  urls.push(files[i]);
});

const obj = title.reduce((acc, title, i) => {
  acc[title] = { url: `../extends/playgrounds/${urls[i]}` };
  return acc;
}, {});

fs.writeFileSync("challenges/data/playObj.json", JSON.stringify(obj));
