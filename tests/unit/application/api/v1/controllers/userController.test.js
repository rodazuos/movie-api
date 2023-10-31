const { OK } = require('http-status');
const User = require('../../../../../../src/domain/user')
const UserController = require('../../../../../../src/application/api/controllers/v1/user');
const { NotFoundException, ConflictException } = require('../../../../../../src/infrastructure/errors')

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
        });

        it('Should return error user', async () => {
            const controller = UserController({ repository });

            User.getUserById = jest.fn().mockImplementationOnce(async () => {throw new Error('Usuário não encontrado!')});

            const ctx = { status: undefined, request: { params: { id: '11' } }};

            try {
                await controller.getUser(ctx);
            } catch (error) {
                expect(error).toEqual(NotFoundException('Usuário não encontrado!'));
            }
        });

        it('Should return deleted user successfully', async () => {
            const controller = UserController({ repository });

            User.deleteUser = jest.fn().mockImplementationOnce(async () => true);

            const ctx = { status: undefined, request: { params: { id: '11' } }};

            await controller.deleteUser(ctx);

            expect(ctx.status).toEqual(OK);
        });

        it('Should return error deleted user', async () => {
            const controller = UserController({ repository });

            User.deleteUser = jest.fn().mockImplementationOnce(async () => { throw new Error('Usuário não encontrado!')});

            const ctx = { status: undefined, request: { params: { id: '11' } }};

            try {
                await controller.deleteUser(ctx);
            } catch (error) {
                expect(error).toEqual(NotFoundException('Usuário não encontrado!'));
            }

        });
    });

    describe('/user', () => {
        it('Should return created user successfully', async () => {
            const controller = UserController({ repository });
            const mockUser = {
                id: 11,
                typeAccount: 2,
                typeAccountDescription: "Usuário",
                cpf: "99999999999",
                name: "Teste",
                isActive: true
            };

            User.createUser = jest.fn().mockImplementationOnce(async () => mockUser);

            const ctx = { status: undefined, request: { body: { typeAccount: 2, cpf: '99999999999', name: 'Teste' } }};

            await controller.createUser(ctx);

            expect(ctx.status).toEqual(OK);
            expect(ctx.body).toEqual(mockUser);
        });

        it('Should return error created user', async () => {
            const controller = UserController({ repository });

            User.createUser = jest.fn().mockImplementationOnce(async () => { throw new Error('Usuário já cadastrado!')});

            const ctx = { status: undefined, request: { body: { typeAccount: 2, cpf: '99999999999', name: 'Teste' } }};

            try {
                await controller.createUser(ctx);
            } catch (error) {
                expect(error).toEqual(ConflictException('Usuário já cadastrado!'));
            }

        });
    });

    describe('/user/myProfile', () => {
        it('Should return user profile successfully', async () => {
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

            const ctx = { status: undefined, request: { userState: { id: '11' } }};

            await controller.getUserProfile(ctx);

            expect(ctx.status).toEqual(OK);
            expect(ctx.body).toEqual(mockUser);
        });

        it('Should return error user profile', async () => {
            const controller = UserController({ repository });

            User.getUserById = jest.fn().mockImplementationOnce(async () => { throw new Error('Usuário não encontrado!')});

            const ctx = { status: undefined, request: { userState: { id: '11' } }};

            try {
                await controller.getUserProfile(ctx);
            } catch (error) {
                expect(error).toEqual(NotFoundException('Usuário não encontrado!'));
            }

        });
    });

    describe('/user/updatePassword', () => {
        it('Should return user with updated password', async () => {
            const controller = UserController({ repository });

            User.updatePassword = jest.fn().mockImplementationOnce(async () => true);

            const ctx = { status: undefined, request: { userState: { id: '11' }, body: { password: '123456'} }};

            await controller.updatePassword(ctx);

            expect(ctx.status).toEqual(OK);
        });

        it('Should return error when update user password', async () => {
            const controller = UserController({ repository });

            User.updatePassword = jest.fn().mockImplementationOnce(async () => { throw new Error('Usuário não encontrado!') });

            const ctx = { status: undefined, request: { userState: { id: '11' }, body: { password: '123456'} }};

            try {
                await controller.updatePassword(ctx);
            } catch (error) {
                expect(error).toEqual(NotFoundException('Usuário não encontrado!'));
            }
        });
    });

    describe('/users/list', () => {
        it('Should return user list', async () => {
            const controller = UserController({ repository });

            const mockListEmpty = {
                data: [{
                    "id": "2",
                    "typeAccount": 1,
                    "typeAccountDescription": "Administrador",
                    "cpf": "999999999",
                    "name": "Admin do Sistema",
                    "isActive": true
                }],
                total: 1,
                page: 1
            };

            User.getUserList = jest.fn().mockImplementationOnce(async () => mockListEmpty);

            const ctx = { status: undefined, request: {  }};

            await controller.getUserList(ctx);

            expect(ctx.status).toEqual(OK);
            expect(ctx.body).toEqual(mockListEmpty);
        });

        it('Should return empty user list', async () => {
            const controller = UserController({ repository });

            const mockListEmpty = {
                data: 0,
                total: 0,
                page: 0
            };

            User.getUserList = jest.fn().mockImplementationOnce(async () => mockListEmpty);

            const ctx = { status: undefined, request: {} };
            await controller.getUserList(ctx);
            expect(ctx.status).toEqual(OK);
            expect(ctx.body).toEqual(mockListEmpty);
        });
    });
})