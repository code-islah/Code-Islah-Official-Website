const { Octokit } = require("@octokit/rest");
require("dotenv").config();


const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST,OPTIONS"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS_HEADERS };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: CORS_HEADERS, body: "Method Not Allowed" };

  let body;
  try { body = JSON.parse(event.body); } 
  catch { return { statusCode: 400, headers: CORS_HEADERS, body: "Invalid JSON" }; }

  const { itemName, itemInfo, htmlContent } = body;
  if (!itemName || !itemInfo || !htmlContent) 
    return { statusCode: 400, headers: CORS_HEADERS, body: "All fields required" };

  const OWNER = process.env.GITHUB_OWNER;
  const REPO = process.env.GITHUB_REPO;
  const TOKEN = process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.trim() : null;
  const BRANCH = process.env.GITHUB_BRANCH;
  const FILE_PATH = "challenges/data/challenges.json";

  const octokit = new Octokit({ auth: TOKEN });

  try {
    // Fetch existing JSON
    let challenges = [];
    let sha;
    try {
      const { data } = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path: FILE_PATH, ref: BRANCH });
      challenges = JSON.parse(Buffer.from(data.content, "base64").toString("utf8"));
      sha = data.sha;
    } catch (err) {
      if (err.status !== 404) throw err; // ignore if file doesn't exist
    }

    const newChallenge = {
      id: Date.now().toString(),
      name: itemName,
      info: itemInfo,
      htmlContent, // entire HTML file as string
      createdAt: new Date().toISOString()
    };

    challenges.push(newChallenge);

    const updatedContent = Buffer.from(JSON.stringify(challenges, null, 2), "utf8").toString("base64");

    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
      message: `Add challenge: ${itemName} (${newChallenge.id})`,
      content: updatedContent,
      sha,
      branch: BRANCH
    });

    return { statusCode: 201, headers: CORS_HEADERS, body: JSON.stringify({ message: "Challenge saved", challenge: newChallenge }) };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: "Failed to save challenge", details: err.message }) };
  }
};
