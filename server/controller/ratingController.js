const { RatingModel } = require("../model/ratingModel");
const { ProductModel } = require("../model/productModel");
const { sequelize } = require("../config/dbConnect");

const recalculateAverage = async (productId) => {
  const result = await RatingModel.findAll({
    where: { productId },
    attributes: [[sequelize.fn("SUM", sequelize.col("rating")), "total"],
                 [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
    raw: true,
  });

  const { total, count } = result[0];
  const average = count > 0 ? (parseFloat(total) / parseInt(count)).toFixed(2) : 0;

  await ProductModel.update({ averageRating: average }, { where: { id: productId } });
  return average;
};

// POST /rating/add
const addRating = async (req, res) => {
  try {
    const { name, email, productId, rating } = req.body;

    if (!name || !email || !productId || !rating) {
      return res.status(400).json({ success: false, message: "name, email, productId and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "rating must be between 1 and 5" });
    }

    const product = await ProductModel.findByPk(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // one rating per email per product
    const existing = await RatingModel.findOne({ where: { email, productId } });
    if (existing) {
      await existing.update({ rating, name });
    } else {
      await RatingModel.create({ name, email, productId, rating });
    }

    const averageRating = await recalculateAverage(productId);

    return res.status(201).json({
      success: true,
      message: existing ? "Rating updated" : "Rating added",
      averageRating: parseFloat(averageRating),
    });
  } catch (error) {
    console.error("addRating error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addRating };
