const express = require("express");
const { testFunction } = require("../controller/userController");
const { saveCategory, getAllCategories, deleteCategory } = require("../controller/categoryController");
const { saveSubCategory, getSubCategoriesByCategory, deleteSubCategory } = require("../controller/subCategoryController");
const { saveProduct, getProductsByCategory, getProductBySlug, deleteProduct, getAllProducts } = require("../controller/productController");
const { generateToken } = require("../controller/authController");
const { addRating } = require("../controller/ratingController");
require("../model/ratingModel");
require("../model/subCategoryModel"); // ensure table is synced
const { upload } = require("../config/multer");
const { authenticate } = require("../middleware/authenticate");

const router = express.Router();

// existing test route
router.get("/test", testFunction);

// Auth routes
router.post("/auth/token", generateToken);

// Category routes
router.post("/category/save", authenticate, upload.single("categoryImage"), saveCategory);
router.get("/category/all", getAllCategories);
router.delete("/category/:id", authenticate, deleteCategory);

// SubCategory routes
router.post("/subcategory/save", authenticate, saveSubCategory);
router.get("/subcategory/by-category/:categoryId", getSubCategoriesByCategory);
router.delete("/subcategory/:id", authenticate, deleteSubCategory);

// Product routes
router.get("/product/all", getAllProducts);
router.post("/product/save", authenticate, upload.single("image"), saveProduct);
router.get("/product/by-category/:categoryId", getProductsByCategory);
router.get("/product/:slug", getProductBySlug);
router.delete("/product/:id", authenticate, deleteProduct);

// Rating routes
router.post("/rating/add", addRating);

module.exports = { router };
