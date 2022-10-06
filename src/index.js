const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const Joi = require('joi');
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

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}).messages({
  'string.min': 'O {{#label}} deve ter pelo menos 6 caracteres',
  'string.email': 'O {{#label}} deve ter o formato "email@email.com"',
  'any.required': 'O campo {{#label}} é obrigatório',
});

const validateLogin = async (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    // const e = { message: error.details[0].message, status: 400 };
    // throw e;
    return res.status(400).json({ message: error.message });
  }
  return next();
  // console.log(error);
};

app.get('/talker', async (req, res) => {
  const talkers = await readTalkersData();

  return res.status(200).json(talkers);
});

app.get('/talker/:id', validateWithIdExists, async (req, res) => {
  const { id } = req.params;
  const talker = await readTalkersDataWithId(Number(id));

  return res.status(200).json(talker);
});

app.post('/login', validateLogin, async (req, res) => {
  // const login = req.body;
  // await validateLogin();
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

// app.use((error, req, res, _next) => {
//   if (error.status) return res.status(error.status).json({ message: error.message });
//   return res.status(500).json({ message: error.message });
// });
