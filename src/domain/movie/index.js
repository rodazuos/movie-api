const { NotFoundException, ConflictException } = require('../../infrastructure/errors');

const returnMovieData = (movie, castList, genreList, includeIdentification = false) => {
  const normalizedata = {
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
    cast: castList.map((castProfile) => {
      const dataObject = new Object({
        name: castProfile.name,
        characterName: castProfile.character_name,
        photo: castProfile.photo
      });
      if (includeIdentification) {
        (dataObject.id = castProfile.id), (dataObject.idCastProfile = castProfile.id_cast_profile);
      }
      return dataObject;
    }),
    genre: genreList.map((genre) => {
      const dataObject = new Object({ description: genre.description });
      if (includeIdentification) {
        (dataObject.id = genre.id), (dataObject.idGenre = genre.id_genre);
      }
      return dataObject;
    })
  };

  return normalizedata;
};

const getMovie = async ({ movieRepository, id, movieCastRepository, movieGenreRepository }) => {
  const movie = await movieRepository.getById(id, {
    includeDeleted: true
  });

  if (!movie) {
    throw NotFoundException('Filme não encontrado!');
  }

  const castList = await movieCastRepository.getAllByMovieId(movie.id);
  const genreList = await movieGenreRepository.getAllByMovieId(movie.id);

  const includeIdentification = true;
  return returnMovieData(movie, castList, genreList, includeIdentification);
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

const updateMovie = async ({ movieRepository, movie, movieCastRepository, movieGenreRepository }) => {
  const objectFilters = { title: movie.title };
  if (movie.originalTitle) {
    objectFilters.originalTitle = movie.originalTitle;
  }

  const movieExists = await movieRepository.getByFilters(objectFilters, movie.id);
  if (movieExists) {
    throw ConflictException('Filme já cadastrado!');
  }

  const result = await movieRepository.update(movie);

  if (!result) {
    throw NotFoundException('Filme não encontrado!');
  }

  await movieCastRepository.updateMultipleEntries(result.id, movie.cast);
  if (movie.cast_new) {
    await movieCastRepository.createMultipleEntries(result.id, movie.cast_new);
  }

  await movieGenreRepository.updateMultipleEntries(result.id, movie.genres);
  if (movie.genres_new) {
    await movieGenreRepository.createMultipleEntries(result.id, movie.genres_new);
  }

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
