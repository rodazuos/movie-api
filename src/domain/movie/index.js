const { NotFoundException, ConflictException, InternalServerException } = require('../../infrastructure/errors');

const returnMovieData = (movie, castList, genreList, averageVote, includeIdentification = false) => {

  const deletedDate = movie?.deletedAt || movie?.deleted_at;

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
    isActive: deletedDate === null || deletedDate === undefined,
    averageVote:  averageVote ? parseFloat(averageVote) : 0
  };
  
  if (castList.length > 0) {
    normalizedata.cast = castList.map((castProfile) => {
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
    })
  };

  if (genreList.length > 0) {
    normalizedata.genres = genreList.map((genre) => {
      const dataObject = new Object({ description: genre.description });
      if (includeIdentification) {
        (dataObject.id = genre.id), (dataObject.idGenre = genre.id_genre);
      }
      return dataObject;
    });
  }

  return normalizedata;
};

const getMovie = async ({ movieRepository, id }) => {
  const movie = await movieRepository.getById(id, {
    includeDeleted: true
  });

  if (!movie) {
    throw NotFoundException('Filme não encontrado!');
  }

    const includeIdentification = true;
  return returnMovieData(movie, [], [], null, includeIdentification);
};

const createMovie = async ({ movieRepository, movie }) => {
  const objectFilters = { title: movie.title };
  if (movie.originalTitle) {
    objectFilters.originalTitle = movie.originalTitle;
  }

  const movieExists = await movieRepository.getByFilters(objectFilters);
  if (movieExists) {
    throw ConflictException('Filme já cadastrado!');
  }

  const result = await movieRepository.create({ ...movie });

  // await movieCastRepository.createMultipleEntries(result.id, movie.cast);
  // await movieGenreRepository.createMultipleEntries(result.id, movie.genres);

  // const castList = await movieCastRepository.getAllByMovieId(result.id);
  // const genreList = await movieGenreRepository.getAllByMovieId(result.id);

  return returnMovieData(result, [], []);
};

const updateMovie = async ({ movieRepository, movie }) => {
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

  // await movieCastRepository.updateMultipleEntries(result.id, movie.cast);
  // if (movie.cast_new) {
  //   await movieCastRepository.createMultipleEntries(result.id, movie.cast_new);
  // }

  // await movieGenreRepository.updateMultipleEntries(result.id, movie.genres);
  // if (movie.genres_new) {
  //   await movieGenreRepository.createMultipleEntries(result.id, movie.genres_new);
  // }

  // const castList = await movieCastRepository.getAllByMovieId(result.id);
  // const genreList = await movieGenreRepository.getAllByMovieId(result.id);

  return returnMovieData(result, [], []);
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

  if (resultMovies.total > 0) {
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

  return { data: 0, total: 0, page: 0};
};

const addGenreMovie = async ({ modelGenreMovie, movieGenreRepository }) => {
  const userExists = await movieGenreRepository.getById(modelGenreMovie.idMovie, modelGenreMovie.idGenre);
  if (userExists) {
    throw ConflictException('Usuário já cadastrado!');
  }
  
  const result = await movieGenreRepository.create(modelGenreMovie.idMovie, modelGenreMovie.idGenre);
  return result;
}

const deleteGenreMovie = async ({ id, movieGenreRepository }) => {
  const result = await movieGenreRepository.deleteById(id);

  if (!result) {
    throw NotFoundException('Gênero não encontrado!');
  }

  return result;
}

const addCastMovie = async ({ modelCastMovie, movieCastRepository }) => {
  const castExists = await movieCastRepository.findByName(
    modelCastMovie.name, modelCastMovie.characterName, modelCastMovie.idMovie, modelCastMovie.idCastProfile
  );
  if (castExists) {
    throw ConflictException('Pessoa já cadastrada no elenco do filme!');
  }
  
  const result = await movieCastRepository.create(modelCastMovie);
  return result;
}

const deleteCastMovie = async ({ id, movieCastRepository }) => {
  const result = await movieCastRepository.deleteById(id);

  if (!result) {
    throw NotFoundException('Pessoa não encontrada no elenco!');
  }

  return result;
}

module.exports = {
  createMovie,
  getMovie,
  updateMovie,
  deleteMovie,
  voteMovie,
  listMovies,
  addGenreMovie,
  deleteGenreMovie,
  addCastMovie,
  deleteCastMovie
};
