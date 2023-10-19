const { NotFoundException, ConflictException } = require('../../infrastructure/errors');

const returnMovieData = (movie) => {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.originalTitle,
    releaseYear: movie.releaseYear,
    ageGroup: movie.ageGroup,
    duration: movie.duration,
    description: movie.description,
    poster: movie.poster,
    lastUpdated: movie.updateAt || movie.createdAt,
    isActive: movie.deletedAt === null
  };
};

const createMovie = async ({ movieRepository, movie }) => {
  
  const objectFilters = { title: movie.title};
  if (movie.originalTitle) {
    objectFilters.originalTitle = movie.originalTitle;
  }
  
  const movieExists = await movieRepository.getByFilters(objectFilters);
  if (movieExists) {
    throw ConflictException('Filme já cadastrado!');
  }

  const result = await movieRepository.create({ ...movie });
  return returnMovieData(result);
};

const getMovie = async ({ movieRepository, id }) => {
  const movie = await movieRepository.getById(id, {
    includeDeleted: true
  });

  if (!movie) {
    throw NotFoundException('Filme não encontrado!');
  }

  return returnMovieData(movie);
};

const updateMovie = async ({ movieRepository, movie }) => {
  const result = await movieRepository.update(movie);

  if (!result) {
    throw NotFoundException('Filme não encontrado!');
  }

  return returnMovieData(result);
};

const deleteMovie = async ({ movieRepository, id }) => {
  const result = await movieRepository.logicDeleteById(id);

  if (!result) {
    throw NotFoundException('Filme não encontrado!');
  }

  return returnMovieData(result);
};

module.exports = {
  createMovie,
  getMovie,
  updateMovie,
  deleteMovie
};
