const { NotFoundException, ConflictException } = require('../../infrastructure/errors');

const returnMovieData = (movie, castList, genreList) => {
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
    isActive: movie.deletedAt === null,
    cast: castList.map(
      (castProfile) =>
        new Object({ name: castProfile.name, characterName: castProfile.character_name, photo: castProfile.photo })
    ),
    genre: genreList.map((genre) => genre.description)
  };
};

const createMovie = async ({ movieRepository, movie, movieCastRepository, movieGenreRepository }) => {
  const objectFilters = { title: movie.title };
  if (movie.originalTitle) {
    objectFilters.originalTitle = movie.originalTitle;
  }

  const movieExists = await movieRepository.getByFilters(objectFilters);
  if (movieExists) {
    throw ConflictException('Filme já cadastrado!');
  }

  const result = await movieRepository.create({ ...movie });

  await movieCastRepository.createMultipleEntries(result.id, movie.cast);
  await movieGenreRepository.createMultipleEntries(result.id, movie.genres);

  const castList = await movieCastRepository.getAllByMovieId(result.id);
  const genreList = await movieGenreRepository.getAllByMovieId(result.id);

  return returnMovieData(result, castList, genreList);
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

const updateMovie = async ({ movieRepository, movie, movieCastRepository, movieGenreRepository }) => {
  const result = await movieRepository.update(movie);

  if (!result) {
    throw NotFoundException('Filme não encontrado!');
  }

  await movieCastRepository.createMultipleEntries(result.id, movie.cast);
  await movieGenreRepository.createMultipleEntries(result.id, movie.genres);

  const castList = await movieCastRepository.getAllByMovieId(result.id);
  const genreList = await movieGenreRepository.getAllByMovieId(result.id);

  return returnMovieData(result, castList, genreList);
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
