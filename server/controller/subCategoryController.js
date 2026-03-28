const { SubCategoryModel } = require("../model/subCategoryModel");
const { CategoryModel } = require("../model/categoryModel");

// POST /subcategory/save — add or update
const saveSubCategory = async (req, res) => {
  try {
    const { id, name, description, categoryId } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({ success: false, message: "name and categoryId are required" });
    }

    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (id) {
      const [updated] = await SubCategoryModel.update(
        { name, description, categoryId },
        { where: { id } }
      );
      if (!updated) {
        return res.status(404).json({ success: false, message: "SubCategory not found" });
      }
      const subCategory = await SubCategoryModel.findByPk(id);
      return res.json({ success: true, message: "SubCategory updated", data: subCategory });
    }

    const subCategory = await SubCategoryModel.create({ name, description, categoryId });
    return res.status(201).json({ success: true, message: "SubCategory created", data: subCategory });
  } catch (error) {
    console.error("saveSubCategory error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /subcategory/by-category/:categoryId
const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const subCategories = await SubCategoryModel.findAll({ where: { categoryId } });
    return res.json({ success: true, data: subCategories });
  } catch (error) {
    console.error("getSubCategoriesByCategory error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /subcategory/:id
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SubCategoryModel.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "SubCategory not found" });
    }
    return res.json({ success: true, message: "SubCategory deleted" });
  } catch (error) {
    console.error("deleteSubCategory error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { saveSubCategory, getSubCategoriesByCategory, deleteSubCategory };
