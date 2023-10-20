module.exports = (dbContext) => {
  const model = dbContext.models.movies_cast;
  const { Op } = dbContext.sequelize;
  const rawSelectQuery = dbContext.rawSelectQuery;
  const notDeletedClause = { deletedAt: null };

  const create = async ({ idMovie, idCastProfile, name, characterName, photo }) => {
    const { dataValues } = await model.create({
      idMovie,
      idCastProfile,
      name,
      characterName,
      photo
    });

    return dataValues;
  };

  const createMultipleEntries = async (movieId, listMovieCast) => {
    listMovieCast.forEach((castProfile) => {
      castProfile.idMovie = movieId;
    });
    const { dataValues } = await model.bulkCreate(listMovieCast);
    return dataValues;
  };

  const getAllByMovieId = async (idMovie) => {
    const queryResult = await rawSelectQuery(
      ` select cp.description, mc."name", mc.character_name, mc.photo
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

  const update = async (movieCastModel) => {
    movieCastModel.updatedAt = dbContext.sequelize.literal("timezone('utc', now())");

    const whereConditions = {
      [Op.and]: [{ id: movieCastModel.id }, notDeletedClause]
    };
    const entityToUpdated = await model.findOne({ where: whereConditions });
    if (!entityToUpdated) {
      return null;
    }

    const { dataValues } = await entityToUpdated.update(movieCastModel);
    return dataValues;
  };

  const logicDeleteById = async (id) => {
    const entity = await model.findOne({
      where: { [Op.and]: [{ id }, notDeletedClause] }
    });

    if (!entity) {
      return null;
    }

    const { dataValues } = await entity.update({
      deletedAt: dbContext.sequelize.literal("timezone('utc', now())")
    });

    return dataValues;
  };

  return {
    create,
    createMultipleEntries,
    getAllByMovieId,
    logicDeleteById,
    update
  };
};
