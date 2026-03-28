const { Op } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const { UserModel } = require("../model/userModel");

const testFunction = async (req, res) => {
  //Filter query (SELECT * FROM ...... WHERE id=2 AND isActive = true)
  // const data = await UserModel.findAll({
  //     where:{
  //         id:[2,3,5],
  //         // firstName: 'vivek',
  //         isActive: true
  //     }
  // });
  // return res.json(data)

  //Using sequelize operator
  // const data  = await UserModel.findAll({
  //     where:{
  //         // id:{
  //         //     // [Op.eq] : 2
  //         //     // [Op.in] : [2,3,5, 50]

  //         // }
  //         [Op.and] : [{id:3}, {isActive: true}]
  //     }
  // });
  // return res.json(data)

  // const updateUser = await UserModel.update(
  //     {
  //         lastName: 'jone',
  //         age: 40
  //     },
  //     {
  //         where:{
  //             id:1
  //         }
  //     }
  // )
  // return res.json(updateUser)

  // const deleteData =  await UserModel.destroy({
  //     where:{
  //         id:1
  //     }
  // });
  // return res.json(deleteData)

  // const data = await UserModel.findByPk(2);
  // return res.json(data);
  // const data = await UserModel.findOne({
  //   where:{
  //     firstName : 'rohan'
  //   }
  // });
  // return res.json(data);
  const [data, created] = await UserModel.findOrCreate({
    where: {
      firstName: "Vivek",
    },
    defaults: {
      firstName: "Vivek",
      lastName: "Sharma",
    },
  });
  return res.json({ data, created });
};

module.exports = { testFunction };

// const { sequelize } = require("../config/dbConnect");
// const { UserModel } = require("../model/userModel");

// const testFunction = async (req, res) => {
//     //To insert data in db
//     /*
//     const newUser = {
//         firstName: 'vivek',
//         lastName: 'kumar',
//         email: 'vivek@gmail.com',
//         password: 'Admin@123',
//         age: 40,
//     }
//     const users = [
//         {
//             firstName: 'vivek',
//             lastName: 'kumar',
//             email: 'vivek@gmail.com',
//             password: 'Admin@123',
//             age: 40,
//         },
//         {
//             firstName: 'aarav',
//             lastName: 'sharma',
//             email: 'aarav.sharma@example.com',
//             password: 'Aarav@123',
//             age: 29,
//         },
//         {
//             firstName: 'anaya',
//             lastName: 'verma',
//             email: 'anaya.verma@example.com',
//             password: 'Anaya#456',
//             age: 25,
//         },
//         {
//             firstName: 'krishna',
//             lastName: 'iyer',
//             email: 'krishna.iyer@example.com',
//             password: 'Krishna@789',
//             age: 34,
//         },
//         {
//             firstName: 'neha',
//             lastName: 'patel',
//             email: 'neha.patel@example.com',
//             password: 'Neha@2022',
//             age: 28,
//         },
//         {
//             firstName: 'rohan',
//             lastName: 'singh',
//             email: 'rohan.singh@example.com',
//             password: 'Rohan@345',
//             age: 32,
//         },
//         {
//             firstName: 'sanya',
//             lastName: 'gupta',
//             email: 'sanya.gupta@example.com',
//             password: 'Sanya@678',
//             age: 27,
//         },
//         {
//             firstName: 'rahul',
//             lastName: 'mishra',
//             email: 'rahul.mishra@example.com',
//             password: 'Rahul@901',
//             age: 37,
//         },
//         {
//             firstName: 'riya',
//             lastName: 'nair',
//             email: 'riya.nair@example.com',
//             password: 'Riya@234',
//             age: 30,
//         },
//         {
//             firstName: 'arjun',
//             lastName: 'joshi',
//             email: 'arjun.joshi@example.com',
//             password: 'Arjun@567',
//             age: 35,
//         },
//     ];
// //   const userDetails = await UserModel.create(newUser);
//     const userDetails = await UserModel.bulkCreate(users);
//   return res.json(userDetails);
//   */

//   //Select queries (SELECT * FROM ......)
//   /*
//   const users = await UserModel.findAll();
//   return res.json(users);
//   */

//   //Specifying attributes only (SELECT firstName, lastName FROM .....)
//   /*
//   const users =  await UserModel.findAll({
//     attributes:['firstName', 'lastName']
//   });
//   return res.json(users);
//   */

//   //Attributes can be rename (SELECT firstName as FN, lastName as LN FROM .....)
//   /*
//   const users =  await UserModel.findAll({
//     attributes:[['firstName', 'FN'], ['lastName', 'LN']]
//   })
//   return res.json(users);
//   */

//   //Aggregation using sequelize function (SELECT count(firstName) as count FROM .....)
// //   const firstNameCount = await UserModel.findAll({
// //     attributes:[[sequelize.fn('SUM', sequelize.col('id')), 'sum' ]]
// //   })
// //   return res.json(firstNameCount);

// const userDetails = await UserModel.findAll({
//     attributes:{
//         exclude:['firstName', 'password']
//     }
// })
//   return res.json(userDetails);

// }

// module.exports = { testFunction }
