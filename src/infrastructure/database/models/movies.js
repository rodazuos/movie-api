module.exports = (sequelize, DataTypes) => {
  const Movies = sequelize.define(
    "movies",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      title: {
        field: "title",
        type: DataTypes.STRING,
        allowNull: false,
      },
      originalTitle: {
        field: "original_title",
        type: DataTypes.STRING,
        allowNull: false,
      },
      releaseYear: {
        field: "release_year",
        type: DataTypes.STRING,
        allowNull: false,
      },
      ageGroup: {
        field: "age_group",
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        field: "duration",
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        field: "description",
        type: DataTypes.STRING,
        allowNull: false,
      },
      poster: {
        field: "poster",
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("timezone('utc', now())"),
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
        allowNull: true,
      },
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Movies;
};
