const { NotFoundException, ConflictException, InternalServerException } = require('../../infrastructure/errors');

const returnMovieData = (movie, castList, genreList, averageVote, includeIdentification = false) => {
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
    averageVote: averageVote ? parseFloat(averageVote) : 0,
    isActive: movie.deletedAt ? movie.deletedAt === null : movie.deleted_at === null,
    cast: castList.map((castProfile) => {
      const dataObject = new Object({
        description: castProfile.description,
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

const getMovie = async ({ movieRepository, id, movieCastRepository, movieGenreRepository, movieVoteRepository }) => {
  const movie = await movieRepository.getById(id, {
    includeDeleted: true
  });

  if (!movie) {
    throw NotFoundException('Filme não encontrado!');
  }

  const castList = await movieCastRepository.getAllByMovieId(movie.id);
  const genreList = await movieGenreRepository.getAllByMovieId(movie.id);
  const averageVote = await movieVoteRepository.getAverageVotes(movie.id);

  const includeIdentification = true;
  return returnMovieData(movie, castList, genreList, averageVote, includeIdentification);
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

  return true;
};

const voteMovie = async ({ movieVoteRepository, voteData }) => {
  const result = await movieVoteRepository.createUpdate({ ...voteData });

  if (!result) {
    throw InternalServerException('Erro ao adicionar voto!');
  }

  return { vote: true };
};

const listMovies = async ({
  movieRepository,
  movieCastRepository,
  movieGenreRepository,
  movieVoteRepository,
  filters
}) => {
  const resultMovies = await movieRepository.getListMovies(filters);

  if (resultMovies.queryResult.length > 0) {
    const listMoviesId = resultMovies.queryResult.map((movie) => movie.id);
    const castMovies = await movieCastRepository.getCastInListMovieId(listMoviesId);
    const genresMovies = await movieGenreRepository.getGenreInListMovieId(listMoviesId);
    const averageMovies = await movieVoteRepository.getAverageListMovies(listMoviesId);

    const normalizedResult = resultMovies.queryResult.map((movie) => {
      const castMovie = castMovies.filter((cast) => cast.id_movie == movie.id);
      const genreMovie = genresMovies.filter((genre) => genre.id_movie == movie.id);
      const averageMovie = averageMovies.filter((averageMovie) => averageMovie.id_movie == movie.id);
      return returnMovieData(movie, castMovie, genreMovie, averageMovie[0]?.average_vote);
    });

    return {
      total: resultMovies.total,
      page: resultMovies.page,
      data: normalizedResult
    };
  }

  return [];
};

module.exports = {
  createMovie,
  getMovie,
  updateMovie,
  deleteMovie,
  voteMovie,
  listMovies
};
