/* eslint-disable no-shadow */
/* eslint-disable eqeqeq */
const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

// возвращает все сохранённые пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find()
    .then((movies) => res.status(200).send({ data: movies }))
    .catch(next);
};

// сохраняет фильм в базу
module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(200).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при сохранении фильма');
      }
    })
    .catch(next);
};

// удаляет сохранённый фильм по id
module.exports.removeMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найдена');
      }
      if (movie.owner == req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((movieRemove) => {
            res.status(200).send({ data: movieRemove });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              throw new BadRequestError('Переданы некорректные данные');
            }
            next();
          });
      } else {
        const err = new Error('У вас нет прав на удаление этого фильма.');
        err.statusCode = 403;
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      next();
    })
    .catch(next);
};
