const jwt = require('../../utils/jwt');
const { UnauthorizedExcepation, InternalServerException } = require('../../infrastructure/errors');
const { createHash } = require('crypto');

const getAuthorization = async ({ userRepository, cpf, password }) => {
  const hash = createHash('sha256');
  const user = await userRepository.getByUser(cpf);

  if (!user || hash.update(password).digest('hex') !== user.password) {
    throw UnauthorizedExcepation('Usuário não autorizado!');
  }

  try {
    const token = await jwt.sign(user);
    const firstAccess = password === '123456';
    return { token, firstAccess };
  } catch (error) {
    throw InternalServerException('Erro ao gerar token de acesso!');
  }
};

const validateToken = async ({ userRepository, token }) => {
  try {
    const dataToken = await jwt.verify(token);
    const user = await userRepository.getById(dataToken.id, {
      includeDeleted: false
    });
    if (!user) {
      throw Error();
    }
  } catch (error) {
    throw UnauthorizedExcepation('Usuário não autorizado!');
  }
};

module.exports = { getAuthorization, validateToken };
