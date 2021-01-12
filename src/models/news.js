"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      News.belongsTo(models.User, {
        as: "creator",
        foreignKey: "userId",
      });
    }
  }
  News.init(
    {
      title: DataTypes.STRING,
      image: DataTypes.STRING,
      imageDescription: DataTypes.STRING,
      content: DataTypes.TEXT,
      readingTime: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "News",
    }
  );
  return News;
};
