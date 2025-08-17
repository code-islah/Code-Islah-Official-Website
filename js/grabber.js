const { log } = require("console");
const fs = require("fs");
const path = require("path");

const inputDir = "./challenges";
const outputFile = "./challenges/data/percentages.json";

function extractWithRegex() {
  const result = {};
  const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".html"));

  files.forEach((file) => {
    const filePath = path.join(inputDir, file);
    const html = fs.readFileSync(filePath, "utf-8");

    const regex =
      /<div class="percentage">\s*<span>(\d+)<\/span>\s*<span>(\d+)<\/span>\s*<span>(\d+)<\/span>\s*<\/div>/i;
    const match = html.match(regex);

    if (match) {
      const [_, span1, span2, span3] = match;
    } else {
      console.log("No match found");
    }

    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
    console.log(`✅ Extracted percentage spans from ${files.length} files`);
  });
}

extractWithRegex();
