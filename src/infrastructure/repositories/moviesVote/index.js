module.exports = (dbContext) => {
  const model = dbContext.models.movies_vote;
  const { Op } = dbContext.sequelize;
  const rawSelectQuery = dbContext.rawSelectQuery;

  const createUpdate = async (movieVoteModel) => {
    if (movieVoteModel.id) {
      const entityToUpdate = await model.findOne({ where: { id: { [Op.eq]: parseInt(movieVoteModel.id) } } });
      entityToUpdate.update({
        ...movieVoteModel,
        updatedAt: dbContext.sequelize.literal("timezone('utc', now())"),
        deletedAt: movieVoteModel.delete ? dbContext.sequelize.literal("timezone('utc', now())") : null
      });
    } else {
      const whereConditions = {
        idMovie: { [Op.eq]: parseInt(movieVoteModel.idMovie) },
        idUser: { [Op.eq]: parseInt(movieVoteModel.idUser) }
      };
      const entityMovieVote = await model.findOne({ where: whereConditions });
      if (!entityMovieVote) {
        await model.create({
          idMovie: movieVoteModel.idMovie,
          idUser: movieVoteModel.idUser,
          vote: movieVoteModel.vote
        });
      } else {
        entityMovieVote.update({
          ...movieVoteModel,
          updatedAt: dbContext.sequelize.literal("timezone('utc', now())"),
          deletedAt: movieVoteModel.delete ? dbContext.sequelize.literal("timezone('utc', now())") : null
        });
      }
    }
    return true;
  };

  const getAverageVotes = async (idMovie) => {
    const queryResult = await rawSelectQuery(
      ` select avg(vote) as averageVote from movies_vote where id_movie = :idMovie;`,
      { idMovie: idMovie }
    );

    if (!queryResult) {
      return null;
    }

    return parseFloat(queryResult[0].averagevote);
  };

  const getAverageListMovies = async (listMoviesId) => {
    const queryResult = await rawSelectQuery(
      `select id_movie, ROUND(avg(vote),1) as average_vote  from movies_vote where id_movie in (:listMoviesId) group by id_movie order by id_movie asc;`,
      { listMoviesId: listMoviesId }
    );

    if (!queryResult) {
      return null;
    }

    return queryResult;
  };

  const getUserVote = async (idMovie, idUser) => {
    const queryResult = await model.findOne({ where: { idMovie: { [Op.eq]: idMovie }, idUser: { [Op.eq]: idUser } } });

    if (!queryResult) {
      return null;
    }

    const { dataValues } = queryResult;
    return dataValues.vote;
  };

  return {
    createUpdate,
    getAverageVotes,
    getAverageListMovies,
    getUserVote
  };
};
