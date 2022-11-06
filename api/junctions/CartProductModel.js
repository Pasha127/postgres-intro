import { DataTypes } from "sequelize"
import sequelize from "../../db.js"

const CartProductModel = sequelize.define("cartProduct", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
})

export default CartProductModel