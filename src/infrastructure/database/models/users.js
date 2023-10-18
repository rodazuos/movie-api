module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      typeAccount: {
        field: "type_account",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cpf: {
        field: "cpf",
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        field: "name",
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        field: "password",
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

  return Users;
};
