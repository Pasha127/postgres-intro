import { DataTypes } from "sequelize"
import sequelize from "../../src/db.js"
import curses from "badwords-list";
import ProductModel from "./ProductModel.js";

const ReviewModel = sequelize.define(
  "review",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {notEmpty: true,not: curses.regex}
    },
    rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {min:1,max:5}
      }
  }
  
) 

export default ReviewModel