"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Direction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Subject }) {
      // define association here
      this.hasMany(Subject, { foreignKey: "direction_id" });
    }
  }
  Direction.init(
    {
      img: DataTypes.STRING,
      title: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Direction",
    }
  );
  return Direction;
};
