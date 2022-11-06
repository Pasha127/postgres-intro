import { DataTypes } from "sequelize"
import sequelize from "../../src/db"
import curses from "badwords-list";

const CategoryModel = await sequelize.define("category", {
  categoryId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    unique: true,
    validate: {notEmpty: true,not: curses.regex}
  },
})

export default CategoryModel