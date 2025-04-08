"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post, Postreaction, Comment, Commentreaction }) {
      // define association here
      this.hasMany(Post, { foreignKey: "user_id" });
      this.hasMany(Postreaction, { foreignKey: "user_id" });
      this.hasMany(Comment, { foreignKey: "user_id" });
      this.hasMany(Commentreaction, { foreignKey: "user_id" });
    }
  }
  User.init(
    {
      login: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
