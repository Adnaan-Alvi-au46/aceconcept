const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const { CategoryModel } = require("./categoryModel");

const SubCategoryModel = sequelize.define(
  "subcategory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: CategoryModel, key: "id" },
    },
  },
  { freezeTableName: true, timestamps: true }
);

CategoryModel.hasMany(SubCategoryModel, { foreignKey: "categoryId" });
SubCategoryModel.belongsTo(CategoryModel, { foreignKey: "categoryId" });

module.exports = { SubCategoryModel };
