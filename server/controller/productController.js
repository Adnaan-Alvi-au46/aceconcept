const { ProductModel } = require("../model/productModel");
const { CategoryModel } = require("../model/categoryModel");
const { SubCategoryModel } = require("../model/subCategoryModel");
const { generateSlug } = require("../service/utils");
const { sequelize } = require("../config/dbConnect");
const { Op, fn, col, literal } = require("sequelize");
const { RatingModel } = require("../model/ratingModel");
// const { UniqueConstraintError } = require("sequelize");

// POST /product/save — add or update a product
const saveProduct = async (req, res) => {
  try {
    const { id, title, description, quantity, price, categoryId, subCategoryId } = req.body;
    const image = req.file ? req.file.filename : undefined;

    if (!title || !price || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "title, price and categoryId are required",
      });
    }

    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // validate subcategory if provided
    if (subCategoryId) {
      const subCategory = await SubCategoryModel.findOne({ where: { id: subCategoryId, categoryId } });
      if (!subCategory) {
        return res.status(404).json({ success: false, message: "SubCategory not found or does not belong to this category" });
      }
    }

    const slug = generateSlug(title);
    console.log(slug);

    if (id) {
      const updateData = {
        title,
        description,
        quantity,
        price,
        categoryId,
        subCategoryId: subCategoryId || null,
        slug,
      };
      if (image) updateData.image = image;

      const [updated] = await ProductModel.update(updateData, {
        where: { id },
      });

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      const product = await ProductModel.findByPk(id);

      return res.json({
        success: true,
        message: "Product updated",
        data: product,
      });
    }

    const product = await ProductModel.create({
      title,
      slug,
      description,
      quantity,
      price,
      categoryId,
      subCategoryId: subCategoryId || null,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Product created",
      data: product,
    });
  } catch (error) {
    console.error("saveProduct error:", error);
    // Handle duplicate title error
    // if (error instanceof UniqueConstraintError) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Product with this title already exists",
    //   });
    // }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ success: false, message: "Product title already exists" });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /product/by-category/:categoryId — get products by category (optionally filter by subcategory)
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10, search = "", sort, subCategoryId } = req.query;

    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // if subCategoryId provided, validate it belongs to this category
    if (subCategoryId) {
      const subCategory = await SubCategoryModel.findOne({ where: { id: subCategoryId, categoryId } });
      if (!subCategory) {
        return res.status(404).json({ success: false, message: "SubCategory not found or does not belong to this category" });
      }
    }

    const offset = (page - 1) * limit;

    const whereCondition = {
      categoryId,
      ...(subCategoryId && { subCategoryId }),
      ...(search && {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      }),
    };

    // Default sorting
    let orderCondition = [["id", "DESC"]];

    if (sort === "price_low") {
      orderCondition = [["price", "ASC"]];
    }

    if (sort === "price_high") {
      orderCondition = [["price", "DESC"]];
    }

    if (sort === "rating") {
      orderCondition = [[literal("averageRating"), "DESC"]];
    }

    const { rows: products, count: totalProducts } =
      await ProductModel.findAndCountAll({
        where: whereCondition,
        attributes: {
          exclude: ["createdAt", "updatedAt", "categoryId"],
        },
        include: [
          {
            model: CategoryModel,
            attributes: ["id", "name"],
          },
          {
            model: SubCategoryModel,
            attributes: ["id", "name"],
          },
          {
            model: RatingModel,
            attributes: [],
          },
        ],
        // attributes: {
        //   include: [
        //     [
        //       fn("AVG", col("rating.rating")),
        //       "averageRating",
        //     ],
        //   ],
        // },
        group: ["product.id"],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: orderCondition,
      });

    return res.json({
      success: true,
      data: products,
      pagination: {
        total: totalProducts.length || totalProducts,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(
          (totalProducts.length || totalProducts) / limit
        ),
      },
    });
  } catch (error) {
    console.error("getProductsByCategory error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await ProductModel.findOne({
      where: { slug },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: CategoryModel,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Fetch related products
    const relatedProducts = await ProductModel.findAll({
      where: {
        categoryId: product.categoryId,
        id: { [Op.ne]: product.id }, // exclude current product
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: sequelize.random(), // random products
      limit: 4,
    });

    return res.json({
      success: true,
      data: product,
      relatedProducts,
    });
  } catch (error) {
    console.error("getProductBySlug error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /product/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductModel.destroy({ where: { id } });
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("deleteProduct error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /product/all?search=
const getAllProducts = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const whereCondition = search
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const products = await ProductModel.findAll({
      where: whereCondition,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        { model: CategoryModel, attributes: ["id", "name"] },
        { model: SubCategoryModel, attributes: ["id", "name"] },
      ],
      order: [["id", "DESC"]],
    });

    return res.json({ success: true, data: products });
  } catch (error) {
    console.error("getAllProducts error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  saveProduct,
  getProductsByCategory,
  getProductBySlug,
  deleteProduct,
  getAllProducts,
};
