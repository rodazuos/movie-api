module.exports = (dbContext) => {
  const model = dbContext.models.movies_cast;
  const rawSelectQuery = dbContext.rawSelectQuery;

  const createMultipleEntries = async (movieId, listMovieCast) => {
    listMovieCast.forEach((castProfile) => {
      castProfile.idMovie = movieId;
    });
    const { dataValues } = await model.bulkCreate(listMovieCast);
    return dataValues;
  };

  const updateMultipleEntries = async (movieId, listMovieCast) => {
    listMovieCast.forEach((castProfile) => {
      castProfile.idMovie = movieId;
      castProfile.updatedAt = dbContext.sequelize.literal("timezone('utc', now())");
      if (castProfile.delete) {
        castProfile.deletedAt = dbContext.sequelize.literal("timezone('utc', now())");
      }
    });

    const { dataValues } = await model.bulkCreate(listMovieCast, {
      updateOnDuplicate: ['idCastProfile', 'name', 'characterName', 'photo', 'updatedAt', 'deletedAt']
    });
    return dataValues;
  };

  const getAllByMovieId = async (idMovie) => {
    const queryResult = await rawSelectQuery(
      ` select mc.id, mc.id_cast_profile, cp.description, mc."name", mc.character_name, mc.photo
            from movies_cast mc inner join cast_profiles cp on mc.id_cast_profile = cp.id 
            where mc.id_movie = :idMovie and mc.deleted_at is null;
          `,
      { idMovie: idMovie }
    );

    if (!queryResult) {
      return null;
    }

    return queryResult;
  };

  const getCastInListMovieId = async (listMoviesId) => {
    const queryResult = await rawSelectQuery(
      ` select mc.id_movie, mc.id, mc.id_cast_profile, cp.description, mc."name", mc.character_name, mc.photo
            from movies_cast mc inner join cast_profiles cp on mc.id_cast_profile = cp.id 
            where mc.id_movie in (:idMovies) and mc.deleted_at is null order by name ASC;
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
    getCastInListMovieId
  };
};
