const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

// возвращает все сохранённые пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
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
      if (!movie) { return next(new NotFoundError('Фильм с указанным _id не найден')); }
      if (movie.owner.toString() === req.user._id) {
        return movie.remove()
          .then(() => { res.send(movie); });
      }
      return next(new Error('У вас нет прав на удаление этого фильма.'));
    })
    .catch((err) => {
      if (err.name === 'Bad Request') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
