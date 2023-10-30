const { sanitizeCreateMovie, 
    sanitizeUpdateMovie
} = require('../../../../../../src/application/api/forms/movie');
const { BadRequestException } = require('../../../../../../src/infrastructure/errors')

describe('Application -> API V1 -> Forms -> Login', () => {
    describe('sanitizeLogin', () => {
        it('Should validate create movie', () => {
            const form = { title: 'title', releaseYear: 'releaseYear', ageGroup: 'ageGroup', duration: 'duration', description: 'description', poster: 'poster' };

            expect(sanitizeCreateMovie(form)).toBeTruthy();
        });

        it('Should error validate create movie', async () => {
            const form = { releaseYear: 'releaseYear', ageGroup: 'ageGroup', duration: 'duration', description: 'description', poster: 'poster' };

            try {
                await sanitizeCreateMovie(form);
            } catch (error) {
                expect(error).toEqual(BadRequestException('"title" is required'));
            }
        });

        it('Should validate update movie', async () => {
            const form = { id: 1, title: 'title', releaseYear: 'releaseYear', ageGroup: 'ageGroup', duration: 'duration', description: 'description', poster: 'poster', active: true };

            try {
                await sanitizeUpdateMovie(form);
            } catch (error) {
                expect(error).toEqual(BadRequestException('"title" is required'));
            }
        });

        it('Should error validate update movie', async () => {
            const form = { title: 'title', releaseYear: 'releaseYear', ageGroup: 'ageGroup', duration: 'duration', description: 'description', poster: 'poster', active: true };

            try {
                await sanitizeUpdateMovie(form);
            } catch (error) {
                expect(error).toEqual(BadRequestException('"id" is required'));
            }
        });
    })
});