import { DataTypes } from "sequelize"
import sequelize from "../../src/db.js"
import curses from "badwords-list";

const CategoryModel = await sequelize.define("category", {
  categoryId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {notEmpty: true,not: curses.regex}
  },
})

export default CategoryModel