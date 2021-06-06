const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovie, removeMovie,
} = require('../controllers/movies');

// возвращает все сохранённые пользователем фильмы
router.get('', getMovies);

// coхраняет фильм
router.post('', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\\/\w.-]*)*\/?/),
    trailer: Joi.string().required().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\\/\w.-]*)*\/?/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\\/\w.-]*)*\/?/),
    movieId: Joi.number().required(),
  }),
}), createMovie);

// удаляет сохранённый фильм по id
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), removeMovie);

module.exports = router;
