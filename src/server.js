import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import errorHandler from "./errorHandler.js"
import { pgConnect, syncModels } from "./db.js"
import productRouter from "../api/products/index.js"
import userRouter from "../api/users/index.js"
import cartRouter from "../api/cart/index.js"
import categoryRouter from "../api/categories/index.js"


const server = express()
const port = process.env.PORT || 3001

server.use(cors())
server.use(express.json())
server.use("/products", productRouter)
server.use("/categories", categoryRouter)
server.use("/users", userRouter)
server.use("/carts", cartRouter)
server.use(errorHandler)

await pgConnect()
await syncModels()

server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is listening on port ${port}`)
  })