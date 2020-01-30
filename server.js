const express = require("express")
const morgan = require("morgan")
// const { Dog } = require("./database")
const dogRoutes = require("./api/dogs")

const app = express()
app.use(morgan("dev"))

app.get("/", async (req, res, next) => {
  res.send(`
    <a href="/api/dogs">Go to dogs</a>
    <a href="/api/dogs/1">Go to dog 1</a>
  `)
})

app.use("/api/dogs", dogRoutes)

const PORT = 3030
app.listen(PORT, () => {
  console.log("listening on port", PORT)
})
