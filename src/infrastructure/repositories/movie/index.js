module.exports = (dbContext) => {
  const model = dbContext.models.movies;
  const { Op } = dbContext.sequelize;
  const notDeletedClause = { deletedAt: null };
  const rawSelectQuery = dbContext.rawSelectQuery;

  const create = async ({ title, originalTitle, releaseYear, ageGroup, duration, description, poster }) => {
    const { dataValues } = await model.create({
      title,
      originalTitle,
      releaseYear,
      ageGroup,
      duration,
      description,
      poster
    });

    return dataValues;
  };

  const getByFilters = async (filters, idMovieUpdate = false) => {
    const preparedFilters = Object.entries(filters).map((filter) => {
      const newObjectFilter = { [filter[0]]: { [Op.eq]: filter[1] } };
      return newObjectFilter;
    });
    let whereConditions = { [Op.or]: preparedFilters };
    if (idMovieUpdate) {
      whereConditions = { id: { [Op.ne]: parseInt(idMovieUpdate) }, [Op.or]: preparedFilters };
    }
    const queryResult = await model.findOne({ where: whereConditions });

    if (!queryResult) {
      return null;
    }

    const { dataValues } = queryResult;
    return dataValues;
  };

  const getById = async (id, { includeDeleted = false } = {}) => {
    const whereConditions = includeDeleted ? { id } : { [Op.and]: [{ id }, notDeletedClause] };

    const queryResult = await model.findOne({ where: whereConditions });

    if (!queryResult) {
      return null;
    }

    const { dataValues } = queryResult;
    return dataValues;
  };

  const update = async (movieModel) => {
    movieModel.updatedAt = dbContext.sequelize.literal("timezone('utc', now())");

    if (movieModel.active) {
      movieModel.deletedAt = null;
    }

    const whereConditions = {
      [Op.and]: [{ id: movieModel.id }]
    };
    const entityToUpdated = await model.findOne({ where: whereConditions });
    if (!entityToUpdated) {
      return null;
    }

    const { dataValues } = await entityToUpdated.update(movieModel);
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

  const prepareQuerySearch = (filters, hasTotal) => {
    let query = ` select distinct 
    m.id, m.title, m.original_title, m.release_year, m.age_group, m.duration, m.description, m.poster, m.deleted_at `;
    if (hasTotal) {
      query = `select count(distinct m.id) as total`;
    }

    query =
      query +
      ` from movies m
    left join movies_cast mc on m.id = mc.id_movie
    left join movies_genres mg on m.id = mg.id_movie
    left join cast_profiles cp on mc.id_cast_profile = cp.id
    left join genres g on mg.id_genre = g.id `;

    if (filters) {
      let queryFilters = [];
      if (filters.title) {
        queryFilters.push(` lower(title) like '%${filters.title.toLowerCase()}%'`);
      }

      if (filters.genre) {
        queryFilters.push(` lower(g.description) like '%${filters.genre.toLowerCase()}%'`);
      }

      if (filters.director && filters.actor) {
        queryFilters.push(
          ` (lower(mc."name") like '%${filters.director}%' or lower(mc."name") like '%${filters.actor}%')`
        );
      } else if (filters.director) {
        queryFilters.push(` lower(mc."name") like '%${filters.director}%'`);
      } else if (filters.actor) {
        queryFilters.push(` lower(mc."name") like '%${filters.actor}%'`);
      }

      if (queryFilters.length > 0) {
        query = query + ' where';
        query = query + queryFilters.join(' AND ');
      }

      const limit = filters.limit ? filters.limit : 10;
      const offset = filters.page && filters.page > 1 ? (filters.page - 1) * limit : 0;

      if (!hasTotal) {
        query = query + ` order by title ASC limit ${limit} offset ${offset};`;
      }
    }

    return query;
  };

  const getListMovies = async (filters) => {
    const queryResult = await rawSelectQuery(prepareQuerySearch(filters));

    if (!queryResult) {
      return null;
    }

    const queryTotalResult = await rawSelectQuery(prepareQuerySearch(filters, true));

    return {
      total: parseInt(queryTotalResult[0].total),
      page: filters.page || 1,
      queryResult
    };
  };

  return {
    create,
    getById,
    logicDeleteById,
    update,
    getByFilters,
    getListMovies
  };
};
