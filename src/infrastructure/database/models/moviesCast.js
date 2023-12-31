module.exports = (sequelize, DataTypes) => {
  const MoviesCast = sequelize.define(
    'movies_cast',
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
      idCastProfile: {
        field: 'id_cast_profile',
        type: DataTypes.INTEGER,
        references: {
          model: 'CastProfiles',
          key: 'id'
        }
      },
      name: {
        field: 'name',
        type: DataTypes.STRING,
        allowNull: false
      },
      characterName: {
        field: 'character_name',
        type: DataTypes.STRING,
        allowNull: true
      },
      photo: {
        field: 'photo',
        type: DataTypes.STRING,
        allowNull: true
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

  return MoviesCast;
};
