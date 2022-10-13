const fs = require('fs').promises;
const path = require('path');
const dataa = require('./talker.json');

const TALKER_DATA_PATH = './talker.json';

console.log(dataa.length);

async function readTalkersData() {
  const data = await fs.readFile(path.resolve(__dirname, TALKER_DATA_PATH));
  const talkers = JSON.parse(data);
  return talkers;
}

async function readTalkersDataWithId(id) {
  const talkers = await readTalkersData();
  const talkerWithId = talkers.find((t) => t.id === id);
  return talkerWithId;
}

function tokenGeneretor() {
  let token = '';
  const caracters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i += 1) {
    token += caracters.charAt(Math.floor(Math.random() * caracters.length));
  }
  return token;
}

async function writeNewTalker(newTalkerInfo) {
  const newId = dataa.length + 1;
  const oldTalkers = await readTalkersData();
  const newTalker = { id: newId, ...newTalkerInfo };
  const allTalker = JSON.stringify([...oldTalkers, newTalker]);
  
  await fs.writeFile(path.resolve(__dirname, TALKER_DATA_PATH), allTalker);
  return newTalker;
}

async function updateTalker(id, updateTalkerInfo) {
  try {
    const talkers = await readTalkersData();
    const infoToUpdate = { id, ...updateTalkerInfo };
    const updatedTalkers = talkers.reduce((ts, cc) => {
      if (cc.id === infoToUpdate.id) {
        return [...ts, infoToUpdate];
      }
      return [...ts, cc];
    }, []);
    const updatedData = JSON.stringify(updatedTalkers);
    await fs.writeFile(path.resolve(__dirname, TALKER_DATA_PATH), updatedData);
    return infoToUpdate;
  } catch (e) {
    console.error(`Erro de escrita: ${e}`);
  }
}

async function deleteTalker(id) {
  try {
    const talkers = await readTalkersData();
    const newTalkers = talkers.filter((talker) => talker.id !== id);

    const newTalkerList = JSON.stringify(newTalkers);
    await fs.writeFile(path.resolve(__dirname, TALKER_DATA_PATH), newTalkerList);
  } catch (e) {
    console.error(`Erro na remoção: ${e}`);
  }
}

async function searchTalker(term) {
  const talkers = await readTalkersData();
  const talkersByTerm = talkers.filter((talker) => talker.name.includes(term));
  return talkersByTerm;
}

module.exports = {
  readTalkersData,
  readTalkersDataWithId,
  tokenGeneretor,
  writeNewTalker,
  updateTalker,
  deleteTalker,
  searchTalker,
};
