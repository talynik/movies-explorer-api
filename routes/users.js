const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, patchUser,
} = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/me', getUser);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email(),
  }),
}), patchUser);

module.exports = router;
