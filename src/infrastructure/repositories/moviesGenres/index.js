module.exports = (dbContext) => {
  const model = dbContext.models.movies_genres;
  const { Op } = dbContext.sequelize;
  const rawSelectQuery = dbContext.rawSelectQuery;
  const notDeletedClause = { deletedAt: null };

  const create = async ({ idMovie, idGenre }) => {
    const { dataValues } = await model.create({
      idMovie,
      idGenre
    });

    return dataValues;
  };

  const createMultipleEntries = async (movieId, listGenres) => {
    listGenres.forEach((castProfile) => {
      castProfile.idMovie = movieId;
    });
    const { dataValues } = await model.bulkCreate(listGenres);
    return dataValues;
  };

  const getAllByMovieId = async (idMovie) => {
    const queryResult = await rawSelectQuery(
      ` select g.description
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

  const update = async (movieGenreModel) => {
    movieGenreModel.updatedAt = dbContext.sequelize.literal("timezone('utc', now())");

    const whereConditions = {
      [Op.and]: [{ id: movieGenreModel.id }, notDeletedClause]
    };
    const entityToUpdated = await model.findOne({ where: whereConditions });
    if (!entityToUpdated) {
      return null;
    }

    const { dataValues } = await entityToUpdated.update(movieGenreModel);
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
