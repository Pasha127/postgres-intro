import { DataTypes } from "sequelize"
import sequelize from "../../src/db.js"
import curses from "badwords-list";
import ReviewModel from "./ReviewModel.js";

const ProductModel = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {notEmpty: true,not: curses.regex }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {notEmpty: true,not: curses.regex}
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {notEmpty: true,not: curses.regex}
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://placekitten.com/420/420",
      validate:{
        isUrl: true
      }
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      }
  }
  
) 

    ProductModel.hasMany(ReviewModel,
        {foreignKey: "productId",onDelete:"cascade", hooks:true})
    ReviewModel.belongsTo(ProductModel)

export default ProductModel