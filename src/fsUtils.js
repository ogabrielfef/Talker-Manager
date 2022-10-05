const fs = require('fs').promises;
const path = require('path');

const TALKER_DATA_PATH = './talker.json';

async function readTalkersData() {
  const data = await fs.readFile(path.resolve(__dirname, TALKER_DATA_PATH));
  const talkers = JSON.parse(data);
  console.log(talkers);
  return talkers;
}

readTalkersData();

module.exports = {
  readTalkersData,
};