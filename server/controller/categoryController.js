const { CategoryModel } = require("../model/categoryModel");
const { upload } = require("../config/multer");

// POST /category/save — add or update a category
const saveCategory = async (req, res) => {
  try {
    const { id, name, description } = req.body;
    const categoryImage = req.file ? req.file.filename : undefined;

    if (!name) {
      return res.status(400).json({ success: false, message: "name is required" });
    }

    if (id) {
      const updateData = { name, description };
      if (categoryImage) updateData.categoryImage = categoryImage;

      const [updated] = await CategoryModel.update(updateData, { where: { id } });
      if (!updated) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
      const category = await CategoryModel.findByPk(id);
      return res.json({ success: true, message: "Category updated", data: category });
    }

    // Create
    const category = await CategoryModel.create({ name, description });
    return res.status(201).json({ success: true, message: "Category created", data: category });
  } catch (error) {
    console.error("saveCategory error:", error);
    
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ success: false, message: "Category name already exists" });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /category/all — get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll();
    return res.json({ success: true, data: categories });
  } catch (error) {
    console.error("getAllCategories error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /category/:id
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CategoryModel.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    return res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("deleteCategory error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { saveCategory, getAllCategories, deleteCategory };
