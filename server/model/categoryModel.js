const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");

const CategoryModel = sequelize.define(
  "category",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "unique_category_name",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = { CategoryModel };
