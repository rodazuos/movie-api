const { sanitizeUpdatePassword, sanitizeFiltersListUser } = require('../../../../../../src/application/api/forms/user');
const { BadRequestException } = require('../../../../../../src/infrastructure/errors')

describe('Application -> API V1 -> Forms -> Login', () => {
    describe('sanitizeLogin', () => {
        it('Should validate update password', () => {
            const form = { password: '123456'};

            expect(sanitizeUpdatePassword(form)).toBeTruthy();
        });

        it('Should error validate update password', async () => {
            const form = { passwod: '123456'};

            try {
                await sanitizeUpdatePassword(form);
            } catch (error) {
                expect(error).toEqual(BadRequestException('"password" is required'));
            }
        });

        it('Should validate user list filter', () => {
            const form = { name: 'name', limit: 10, page: 1};

            expect(sanitizeFiltersListUser(form)).toBeTruthy();
        });
    })
});