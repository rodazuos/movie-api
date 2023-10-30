const { OK } = require('http-status');
const User = require('../../../../../../src/domain/user')
const UserController = require('../../../../../../src/application/api/controllers/v1/user');

const repository = {
    userRepository: async () => []
}

describe('Application -> Api V1 -> Controllers -> User', () => {
    describe('/user/:id', () => {
        it('Should return user successfully', async () => {
            const controller = UserController({ repository });
            const mockUser = {
                id: 11,
                typeAccount: 2,
                typeAccountDescription: "Usuário",
                cpf: "99999999999",
                name: "Teste",
                isActive: true
            };

            User.getUserById = jest.fn().mockImplementationOnce(async () => mockUser);

            const ctx = { status: undefined, request: { params: { id: '11' } }};

            await controller.getUser(ctx);

            expect(ctx.status).toEqual(OK);
            expect(ctx.body).toEqual(mockUser);
        })
    })
})