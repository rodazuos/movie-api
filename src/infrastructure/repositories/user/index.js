module.exports = (dbContext) => {
  const model = dbContext.models.users;
  const { Op } = dbContext.sequelize;
  const notDeletedClause = { deletedAt: null };
  const rawSelectQuery = dbContext.rawSelectQuery;

  const create = async ({ typeAccount, cpf, name, password }) => {
    const { dataValues } = await model.create({
      typeAccount,
      cpf,
      name,
      password
    });

    return dataValues;
  };

  const getByUser = async (cpf) => {
    const whereConditions = { [Op.and]: [{ cpf }, notDeletedClause] };
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

  const update = async (userModel) => {
    userModel.updatedAt = dbContext.sequelize.literal("timezone('utc', now())");

    if (userModel.active) {
      userModel.deletedAt = null;
    }

    const whereConditions = {
      [Op.and]: [{ id: userModel.id, cpf: userModel.cpf }]
    };
    const entityToUpdated = await model.findOne({ where: whereConditions });
    if (!entityToUpdated) {
      return null;
    }

    const { dataValues } = await entityToUpdated.update(userModel);
    return dataValues;
  };

  const updatePassword = async (userModel) => {
    userModel.updatedAt = dbContext.sequelize.literal("timezone('utc', now())");

    const whereConditions = {
      [Op.and]: [{ id: userModel.id }, notDeletedClause]
    };
    const entityToUpdated = await model.findOne({ where: whereConditions });
    if (!entityToUpdated) {
      return null;
    }

    const { dataValues } = await entityToUpdated.update(userModel);
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
    let query = ` select id, type_account, cpf, name, deleted_at `;
    if (hasTotal) {
      query = `select count(distinct id) as total`;
    }

    query =
      query +
      ` from users `;

    if (filters) {
      let queryFilters = [];
      if (filters.name) {
        queryFilters.push(` lower(name) like '%${filters.name.toLowerCase()}%'`);
      }

      if (queryFilters.length > 0) {
        query = query + ' where';
        query = query + queryFilters.join(' AND ');
      }
      
      const limit = filters.limit ? filters.limit : 10;
      const offset = filters.page && filters.page > 1 ? (filters.page - 1) * limit : 0;
      
      if (!hasTotal) {
        query = query + ` order by name ASC limit ${limit} offset ${offset};`;
      }
    }

    return query;
  };

  const getListUsers = async (filters) => {
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
    getByUser,
    getListUsers,
    logicDeleteById,
    update,
    updatePassword
  };
};
