const { sanitizeLogin } = require('../../../../../../src/application/api/forms/login');
const { BadRequestException } = require('../../../../../../src/infrastructure/errors')

describe('Application -> API V1 -> Forms -> Login', () => {
    describe('sanitizeLogin', () => {
        it('Should validate cpf and password', () => {
            const form = { cpf: '99999999999', password: '123456'};

            expect(sanitizeLogin(form)).toBeTruthy();
        });

        it('Should error validate cpf', async () => {
            const form = { cp: '99999999999', password: '123456'};

            try {
                await sanitizeLogin(form);
            } catch (error) {
                expect(error).toEqual(BadRequestException('"cpf" is required'));
            }
        });

        it('Should error validate password', async () => {
            const form = { cpf: '99999999999', passwor: '123456'};

            try {
                await sanitizeLogin(form);
            } catch (error) {
                expect(error).toEqual(BadRequestException('"password" is required'));
            }
        });
    })
});