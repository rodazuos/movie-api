module.exports = (dbContext) => {
  const model = dbContext.models.movies_genres;
  const rawSelectQuery = dbContext.rawSelectQuery;

  const createMultipleEntries = async (movieId, listGenres) => {
    listGenres.forEach((genre) => {
      genre.idMovie = movieId;
    });
    const { dataValues } = await model.bulkCreate(listGenres);
    return dataValues;
  };

  const updateMultipleEntries = async (movieId, listGenres) => {
    listGenres.forEach((genre) => {
      genre.idMovie = movieId;
      genre.updatedAt = dbContext.sequelize.literal("timezone('utc', now())");
      if (genre.delete) {
        genre.deletedAt = dbContext.sequelize.literal("timezone('utc', now())");
      }
    });
    const { dataValues } = await model.bulkCreate(listGenres, { updateOnDuplicate: ['updatedAt', 'deletedAt'] });
    return dataValues;
  };

  const getAllByMovieId = async (idMovie) => {
    const queryResult = await rawSelectQuery(
      ` select mg.id, mg.id_genre, g.description
          from movies_genres mg inner join genres g on mg.id_genre = g.id 
          where mg.id_movie = :idMovie and mg.deleted_at is null;
        `,
      { idMovie: idMovie }
    );

    if (!queryResult) {
      return null;
    }

    return queryResult;
  };

  const getGenreInListMovieId = async (listMoviesId) => {
    const queryResult = await rawSelectQuery(
      ` select mg.id_movie, g.description
      from movies_genres mg inner join genres g on mg.id_genre = g.id 
      where mg.id_movie in (:idMovies) and mg.deleted_at is null order by description ASC;
          `,
      { idMovies: listMoviesId }
    );

    if (!queryResult) {
      return null;
    }

    return queryResult;
  };

  return {
    createMultipleEntries,
    updateMultipleEntries,
    getAllByMovieId,
    getGenreInListMovieId
  };
};