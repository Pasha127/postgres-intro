import { DataTypes } from "sequelize"
import sequelize from "../../src/db.js"

const ProductModel = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://placekitten.com/420/420"
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      }
  }
  
) 

export default ProductModel