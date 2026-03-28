require("dotenv").config();
const express = require("express");
const path = require("path");
const { router } = require("./routes/router");
const { dbConnection, sequelize } = require("./config/dbConnect");

const app = express();
const PORT = process.env.PORT || 3001;
console.log("ENV CHECK:", process.env.MYSQL_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", router);

const cleanDuplicateIndexes = async (table, keepIndex) => {
  try {
    const [indexes] = await sequelize.query(`SHOW INDEX FROM \`${table}\``);
    const seen = {};
    for (const idx of indexes) {
      const key = idx.Key_name;
      if (key === "PRIMARY") continue;
      if (seen[key]) {
        await sequelize.query(`ALTER TABLE \`${table}\` DROP INDEX \`${key}\``);
      } else {
        seen[key] = true;
      }
    }
  } catch (e) {
    // table may not exist yet, skip
  }
};

(async () => {
  try {
    // Clean up duplicate indexes caused by previous alter:true runs
    await cleanDuplicateIndexes("category");
    await cleanDuplicateIndexes("product");

    // Use force:false — only creates tables if they don't exist, never alters
    await sequelize.sync({ force: false });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
  dbConnection();
});
