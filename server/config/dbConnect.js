require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB Connected");
  } catch (error) {
    console.error("❌ DB Error:", error);
  }
};

module.exports = { dbConnection, sequelize };



// require("dotenv").config();
// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "mysql",
//     logging: false,
//   },
// );

// const dbConnection = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Db Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// module.exports = { dbConnection, sequelize };
