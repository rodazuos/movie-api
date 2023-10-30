const { sanitizeCreateMovie, 
    sanitizeUpdateMovie,
    sanitizeMovieVote,
    sanitizeFiltersListMovie,
    sanitizeCreateCastMovie
} = require('../../../../../../src/application/api/forms/movie');
const { BadRequestException } = require('../../../../../../src/infrastructure/errors')

describe('Application -> API V1 -> Forms -> Movie', () => {
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

            await sanitizeUpdateMovie(form);
        });

        it('Should error validate update movie', async () => {
            const form = { title: 'title', releaseYear: 'releaseYear', ageGroup: 'ageGroup', duration: 'duration', description: 'description', poster: 'poster', active: true };

            try {
                await sanitizeUpdateMovie(form);
            } catch (error) {
                expect(error).toEqual(BadRequestException('"id" is required'));
            }
        });

        it('Should validate movie vote', async () => {
            const form = { idMovie: 4, idUser: 2, vote: 3 };

            expect(sanitizeMovieVote(form)).toBeTruthy();
        });

        it('Should error validate movie vote', async () => {
            const form = { idMovie: 4, idUser: 2 };

            try {
                await sanitizeMovieVote(form);
            } catch (error) {
                expect(error).toEqual(BadRequestException('"vote" is required'));
            }
        });

        it('Should error validate movie vote when greather 4', async () => {
            const form = { idMovie: 4, idUser: 2, vote: 5 };

            try {
                await sanitizeMovieVote(form);
            } catch (error) {
                expect(error).toEqual(BadRequestException('"vote" must be less than or equal to 4'));
            }
        });

        it('Should validate movie list filter', async () => {
            const form = { title: 'title', director: 'director', genre: 'genre', actor: 'actor', limit: '10', page: 1 };

            expect(sanitizeFiltersListMovie(form)).toBeTruthy();
        });

        it('Should validate movie list filter with limit greather 10', async () => {
            const form = { title: 'title', director: 'director', genre: 'genre', actor: 'actor', limit: '11', page: 1 };

            try {
                await sanitizeFiltersListMovie(form);
            } catch (error) {
                expect(error).toEqual(BadRequestException('"limit" must be less than or equal to 10'));
            }
        });

        it('Should validate create cast movie', async () => {
            const form = { idMovie: 1, idCastProfile: 2, name: 'name', characterName: 'characterName', photo: 'photo' };

            expect(sanitizeCreateCastMovie(form)).toBeTruthy();
        });
    })
});