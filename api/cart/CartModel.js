import { DataTypes } from "sequelize"
import curses from "badwords-list";
import sequelize from "../../src/db.js";

const CartModel = sequelize.define(
  "cart",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true
    }
  }
  
) 

export default CartModel