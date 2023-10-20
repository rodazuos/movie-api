module.exports = (dbContext) => {
  const model = dbContext.models.movies_cast;
  const { Op } = dbContext.sequelize;
  const rawSelectQuery = dbContext.rawSelectQuery;
  const notDeletedClause = { deletedAt: null };

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

  return {
    createMultipleEntries,
    updateMultipleEntries,
    getAllByMovieId
  };
};
