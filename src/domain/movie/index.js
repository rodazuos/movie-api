const { NotFoundException, ConflictException } = require('../../infrastructure/errors');

const createMovie = async ({ movieRepository, movie }) => {
  const movieExists = await movieRepository.getByFilters({ title: movie.title, originalTitle: movie.originalTitle });
  if (movieExists) {
    throw ConflictException('Filme já cadastrado!');
  }

  const result = await movieRepository.create({ ...movie });
  return result;
};

const getMovie = async ({ movieRepository, id }) => {
  const movie = await movieRepository.getById(id, {
    includeDeleted: true
  });

  if (!movie) {
    throw NotFoundException('Filme não encontrado!');
  }

  return movie;
};

const updateMovie = async ({ movieRepository, movie }) => {
  const result = await movieRepository.update(movie);

  if (!result) {
    throw NotFoundException('Filme não encontrado!');
  }

  return result;
};

const deleteMovie = async ({ movieRepository, id }) => {
  const result = await movieRepository.logicDeleteById(id);

  if (!result) {
    throw NotFoundException('Filme não encontrado!');
  }

  return result;
};

module.exports = {
  createMovie,
  getMovie,
  updateMovie,
  deleteMovie
};
