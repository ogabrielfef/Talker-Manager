const fs = require('fs').promises;
const path = require('path');

const TALKER_DATA_PATH = './talker.json';

async function readTalkersData() {
  const data = await fs.readFile(path.resolve(__dirname, TALKER_DATA_PATH));
  const talkers = JSON.parse(data);
  return talkers;
}

async function readTalkersDataWithId(id) {
  const talkers = await readTalkersData();
  const talkerWithId = talkers.find(t => t.id === id)
  return talkerWithId;
}

module.exports = {
  readTalkersData,
  readTalkersDataWithId
};