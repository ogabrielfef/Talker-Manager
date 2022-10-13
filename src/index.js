const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const { readTalkersData, readTalkersDataWithId, tokenGeneretor,
  writeNewTalker, updateTalker, deleteTalker, searchTalker } = require('./fsUtils');
  const { validateWithIdExists, validateLogin, validateToken,
  validateName, validateTalker, validateRate } = require('./middlewares');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.get('/talker', async (req, res) => {
  const talkers = await readTalkersData();
  
  return res.status(200).json(talkers);
});

app.get('/talker/search', validateToken, async (req, res) => {
  const { q } = req.query;
  const talkerBySearch = await searchTalker(q);

  return res.status(200).json(talkerBySearch);
});

app.get('/talker/:id', validateWithIdExists, async (req, res) => {
  const { id } = req.params;
  const talker = await readTalkersDataWithId(Number(id));

  return res.status(200).json(talker);
});

app.post('/login', validateLogin, async (req, res) => {
  const token = tokenGeneretor();

  return res.status(200).json({ token });
});

app.post('/talker', validateToken, validateName, validateTalker, validateRate, async (req, res) => {
  console.log('testando token', req.headers);
  const newTalkerInfo = req.body;

  const newTalker = await writeNewTalker(newTalkerInfo);
  return res.status(201).json(newTalker);
});

app.put('/talker/:id', validateToken, validateName,
  validateTalker, validateRate, async (req, res) => {
  const { id } = req.params;

  const talker = await updateTalker(Number(id), req.body);
  return res.status(200).json(talker);
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;

  await deleteTalker(Number(id));
  return res.status(204).end();
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
