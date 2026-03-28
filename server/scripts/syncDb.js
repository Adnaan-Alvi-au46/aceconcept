require("dotenv").config();
require("../model/userModel");
require("../model/categoryModel");
require("../model/subCategoryModel");
require("../model/productModel");
require("../model/ratingModel");

const { sequelize } = require("../config/dbConnect");

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database altered and synchronized successfully");
    process.exit(0);
  } catch (error) {
    console.error("Sync failed:", error.message);
    process.exit(1);
  }
})();
