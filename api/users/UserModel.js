import { DataTypes } from "sequelize"
import sequelize from "../../db.js"
import curses from "badwords-list";
import ProductModel from "../products/ProductModel.js";
import ReviewModel from "../products/ReviewModel.js";
import CartModel from "../cart/CartModel.js";


const UserModel = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {notEmpty: true, not: curses.regex }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {notEmpty: true, not: curses.regex }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {notEmpty: true, isEmail: true, not: curses.regex }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {notEmpty: true, not: curses.regex }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {notEmpty: true, not: curses.regex }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(2),
      allowNull: false,
      validate: {notEmpty: true, not: curses.regex }
    },
  }

) 
UserModel.hasMany(ProductModel,
    {foreignKey: "userId",onDelete:"NO ACTION", hooks:true})
  ProductModel.belongsTo(UserModel);
UserModel.hasMany(ReviewModel,
    {foreignKey: "userId",onDelete:"NO ACTION", hooks:true})
  ReviewModel.belongsTo(UserModel);

UserModel.belongsToMany(CartModel, {
  through: UserCartModel,
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
})
CartModel.belongsToMany(UserModel, {
  through: UserCartModel,
  foreignKey: {
    name: "cartId",
    allowNull: false,
  },
})
export default UserModel