module.exports = (dbContext) => {
  const model = dbContext.models.movies_genres;
  const { Op } = dbContext.sequelize;
  const rawSelectQuery = dbContext.rawSelectQuery;

  const create = async (idMovie, idGenre) => {
    const { dataValues } = await model.create({
      idMovie,
      idGenre
    });

    return dataValues;
  };

  const getById = async (idMovie, idGenre) => {
    const whereConditions = { [Op.and]: [{ idMovie }, { idGenre }] };

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
    create,
    getById,
    deleteById,
    getAllByMovieId,
    getGenreInListMovieId
  };
};
