module.exports = (dbContext) => {
  const model = dbContext.models.movies_cast;
  const { Op } = dbContext.sequelize;
  const rawSelectQuery = dbContext.rawSelectQuery;

  const create = async (modelCastMovie) => {
    const { dataValues } = await model.create({
      ...modelCastMovie
    });

    return dataValues;
  };

  const findByName = async (name, idMovie, idCastProfile) => {
    const whereConditions = { [Op.and]: [{ name }, { idMovie }, { idCastProfile }] };

    const queryResult = await model.findOne({ where: whereConditions });

    if (!queryResult) {
      return null;
    }

    const { dataValues } = queryResult;
    return dataValues;
  };

  const deleteById = async (id) => {
    const entity = await model.findOne({
      where: { [Op.and]: [{ id }] }
    });

    if (!entity) {
      return null;
    }

    await entity.destroy();

    return true;
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
    create,
    findByName,
    deleteById,
    getAllByMovieId,
    getCastInListMovieId
  };
};
