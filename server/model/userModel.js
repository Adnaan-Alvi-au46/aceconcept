const {sequelize} = require('../config/dbConnect');
const {  DataTypes } = require('sequelize');


const UserModel = sequelize.define('user', {
  // Model attributes are defined here
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  age: DataTypes.INTEGER,
  isActive:{
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  // Other model options go here
  freezeTableName: true
});

module.exports = {UserModel}