module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Snippet",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      session_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      code: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users", // Table name
          key: "id",
        },
      },
    },
    {
      timestamps: true,
    }
  );
};
