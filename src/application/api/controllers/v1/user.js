const { OK } = require('http-status');
const UserDomain = require('../../../../domain/user');
const Logger = require('../../../../utils/logger');
const { sanitizeUpdatePassword, sanitizeFiltersListUser } = require('../../forms/user');

module.exports = ({ repository }) => {
  const { userRepository } = repository;

  const getUserProfile = async (ctx) => {
    try {
      const { id } = ctx.request.userState;

      const result = await UserDomain.getUserById({ userRepository, id });

      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const getUser = async (ctx) => {
    try {
      const { id } = ctx.request.params;

      const result = await UserDomain.getUserById({ userRepository, id });

      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const getUserList = async (ctx) => {
    try {
      const filters = await sanitizeFiltersListUser(ctx.request.query);

      const result = await UserDomain.getUserList({ userRepository, filters });

      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const createUser = async (ctx) => {
    try {
      const { typeAccount, cpf, name } = ctx.request.body;
      const user = {
        typeAccount,
        cpf,
        name
      };

      const result = await UserDomain.createUser({
        userRepository,
        user
      });

      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const updateUser = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      const { typeAccount, cpf, name, active } = ctx.request.body;

      const user = {
        id,
        typeAccount,
        cpf,
        name,
        active
      };

      const result = await UserDomain.updateUser({
        userRepository,
        user
      });

      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const deleteUser = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      await UserDomain.deleteUser({ userRepository, id });
      ctx.status = OK;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const updatePassword = async (ctx) => {
    try {
      const { password } = await sanitizeUpdatePassword(ctx.request.body);
      const { id } = ctx.request.userState;

      await UserDomain.updatePassword({
        userRepository,
        id,
        password
      });

      ctx.status = OK;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  return {
    getUserProfile,
    getUser,
    getUserList,
    createUser,
    updateUser,
    deleteUser,
    updatePassword
  };
};
