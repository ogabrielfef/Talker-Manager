const express = require('express');
const bodyParser = require('body-parser');
const { readTalkersData, readTalkersDataWithId, tokenGeneretor } = require('./fsUtils');
const talkersObject = require('./talker.json');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const validateWithIdExists = (req, res, next) => {
  const id = Number(req.params.id);
  if (talkersObject.some((t) => t.id === id)) {
    return next();
  }
  res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
};

// const validateLogin = (req, res, next) => {
//   const requiredProperts = ['email', 'password'];
//   if (requiredProperts.every((property) => property in req.body)) {
//     next();
//   } else {
//     res.status(400).send({ message: 'A missão precisa receber os atributos corretos' });
//   }
// };

app.get('/talker', async (req, res) => {
  const talkers = await readTalkersData();

  return res.status(200).json(talkers);
});

app.get('/talker/:id', validateWithIdExists, async (req, res) => {
  const { id } = req.params;
  const talker = await readTalkersDataWithId(Number(id));

  return res.status(200).json(talker);
});

app.post('/login', async (req, res) => {
  const token = tokenGeneretor();

  return res.status(200).json({ token });
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
