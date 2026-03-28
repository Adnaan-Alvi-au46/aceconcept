const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const { ProductModel } = require("./productModel");

const RatingModel = sequelize.define(
  "rating",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: ProductModel, key: "id" },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
  },
  { freezeTableName: true, timestamps: true }
);

ProductModel.hasMany(RatingModel, { foreignKey: "productId" });
RatingModel.belongsTo(ProductModel, { foreignKey: "productId" });

module.exports = { RatingModel };
