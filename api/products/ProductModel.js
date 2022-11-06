import { DataTypes } from "sequelize"
import sequelize from "../../src/db.js"
import curses from "badwords-list";
import ReviewModel from "./ReviewModel.js";
import CategoryModel from "../categories/CategoryModel.js";
import ProductCategoryModel from "../junctions/ProductCategoryModel.js";
import CartProductModel from "../junctions/CartProductModel.js";
import CartModel from "../cart/CartModel.js";

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
    /* category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {notEmpty: true,not: curses.regex}
    }, */
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
    ReviewModel.belongsTo(ProductModel);

    ProductModel.belongsToMany(CategoryModel, {
      through: ProductCategoryModel,
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
    })
    CategoryModel.belongsToMany(ProductModel, {
      through: ProductCategoryModel,
      foreignKey: {
        name: "categoryId",
        allowNull: false,
      },
    })
    ProductModel.belongsToMany(CartModel, {
      through: CartProductModel,
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
    })
    CartModel.belongsToMany(ProductModel, {
      through: CartProductModel,
      foreignKey: {
        name: "cartId",
        allowNull: false,
      },
    })
    

export default ProductModel