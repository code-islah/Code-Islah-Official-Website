require('dotenv').config();
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN, request: { timeout: 20000 } });

const owner = 'code-islah';
const repo = 'Code-Islah-Official-Website';
const path = 'challenges/data/percentages.json';
const branch = 'main';

async function updateFile() {
  try {
    console.log(`→ Fetching file: ${repo}/${branch}/${path}`);

    const { data: fileData } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
    console.log(`→ File SHA fetched: ${fileData.sha}`);

    let content = Buffer.from(fileData.content, 'base64').toString();
    let json = JSON.parse(content);
    json.lastUpdated = new Date().toISOString();

    const newContent = Buffer.from(JSON.stringify(json, null, 2)).toString('base64');

    console.log('→ Attempting to update the file...');

    await octokit.repos.createOrUpdateFileContents({
      owner, repo, path,
      message: 'Update JSON via GitHub API',
      content: newContent,
      sha: fileData.sha,
      branch,
    });

    console.log('✅ File successfully updated!');
  } catch (err) {
    console.error('⚠ Error:', err.status || err.code, err.message);
    if (err.response && err.response.data) {
      console.error('⚠ GitHub Response:', err.response.data);
    }
  }
}

updateFile();
