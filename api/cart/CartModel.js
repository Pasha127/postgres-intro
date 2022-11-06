import { DataTypes } from "sequelize"
import sequelize from "../../src/db.js"
import curses from "badwords-list";

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