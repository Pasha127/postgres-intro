import { DataTypes } from "sequelize"
import sequelize from "../../db.js"

const UserCartModel = sequelize.define("userCart", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
})

export default UserCartModel