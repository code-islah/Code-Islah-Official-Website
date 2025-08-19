const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function extractWithProperLoading() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-web-security", // Bypass CORS for local files
      "--allow-file-access-from-files",
    ],
  });

  const context = await browser.newContext({
    acceptDownloads: true,
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();
  const results = {};

  const files = fs
    .readdirSync("./challenges")
    .filter((f) => f.endsWith(".html"));

  let index = 0;
  for (const file of files) {
    const absolutePath = path.resolve("./challenges", file);
    try {
      // Method 1: Load via file URL (best for local development)
      await page.goto(`file://${absolutePath}`, {
        waitUntil: "networkidle", // Wait for all resources
        timeout: 30000,
      });

      // Method 2: Alternative - Serve files via local server
      // await page.goto(`http://localhost:3000/${file}`);

      // Verify page loaded correctly
      await page.waitForFunction(() => document.readyState === "complete", {
        timeout: 15000,
      });

      // Debug: Check loaded resources
      const stylesLoaded = await page.$$eval(
        'link[rel="stylesheet"]',
        (links) => links.every((link) => Boolean(link.sheet))
      );
      console.log(`Styles loaded: ${stylesLoaded}`);

      const scriptsLoaded = await page.$$eval("script", (scripts) =>
        scripts.every((script) => !script.src || script.dataset.loaded)
      );

      // Now extract your spans
      const spans = await page.$$eval("div.percentage span", (els) =>
        els.slice(0, 3).map((el) => el.textContent.trim())
      );

      results[index.toString()] = {
        span1: spans[0],
        span2: spans[1],
        span3: spans[2],
      };
    } catch (err) {
      console.error(`Failed on ${file}:`, err);
      results[index.toString()] = { error: err.message };

      // Capture debug info
      await page.screenshot({ path: `debug_${file}.png` });
      const html = await page.content();
      fs.writeFileSync(`debug_${file}.html`, html);
    }
    index++;
  }

  await browser.close();
  fs.writeFileSync(
    "./challenges/data/percentages.json",
    JSON.stringify(results, null, 2)
  );
}

extractWithProperLoading().catch(console.error);
