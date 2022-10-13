const Joi = require('joi');
const talkersObject = require('./talker.json');

const CAMPO_OBRIGATORIO = 'O campo {{#label}} é obrigatório';
const DATA_FORMAT = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

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
  'any.required': CAMPO_OBRIGATORIO,
});

const validateLogin = async (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  return next();
};

const validateToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (token.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  return next();
};

const validateName = async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (req.body.name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  if (!req.body.age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (req.body.age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  return next();
};

const validateTalker = async (req, res, next) => {
  if (!req.body.talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  if (!req.body.talk.watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!req.body.talk.watchedAt
    .match(DATA_FORMAT)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const validateRate = async (req, res, next) => {
  if (req.body.talk.rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  const { rate } = req.body.talk;
  if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

module.exports = {
  validateWithIdExists,
  validateLogin,
  validateToken,
  validateName,
  validateTalker,
  validateRate,
};