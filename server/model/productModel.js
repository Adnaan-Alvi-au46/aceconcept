const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const { CategoryModel } = require("./categoryModel");
const { SubCategoryModel } = require("./subCategoryModel");

const ProductModel = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "unique_product_title",
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "unique_product_slug",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CategoryModel,
        key: "id",
      },
    },
    subCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
);

// Associations
CategoryModel.hasMany(ProductModel, { foreignKey: "categoryId" });
ProductModel.belongsTo(CategoryModel, { foreignKey: "categoryId" });

SubCategoryModel.hasMany(ProductModel, { foreignKey: "subCategoryId" });
ProductModel.belongsTo(SubCategoryModel, { foreignKey: "subCategoryId" });

module.exports = { ProductModel };
