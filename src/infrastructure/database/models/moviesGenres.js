module.exports = (sequelize, DataTypes) => {
  const MoviesGenre = sequelize.define(
    'movies_genres',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      idMovie: {
        field: 'id_movie',
        type: DataTypes.BIGINT,
        references: {
          model: 'Movies',
          key: 'id'
        }
      },
      idGenre: {
        field: 'id_genre',
        type: DataTypes.INTEGER,
        references: {
          model: 'Genres',
          key: 'id'
        }
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("timezone('utc', now())")
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        allowNull: true
      },
      deletedAt: {
        field: 'deleted_at',
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      freezeTableName: true,
      timestamps: false
    }
  );

  return MoviesGenre;
};
