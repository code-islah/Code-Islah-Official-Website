const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const file = fs.readFileSync("chlng.html", "utf-8");

const dom = new JSDOM(file);
const doc = dom.window.document;

const counter = doc.querySelectorAll(".counter div").length;

const updateJSON = fs.readFileSync("challenges/data/countData.json");

const data = JSON.parse(updateJSON);
data.count = counter;

const updatedJSON = JSON.stringify(data, null, 2);
fs.writeFileSync("challenges/data/countData.json", updatedJSON);
