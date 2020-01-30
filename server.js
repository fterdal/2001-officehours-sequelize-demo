const express = require("express")
const morgan = require("morgan")

const app = express()
app.use(morgan("dev"))

const PORT = 3030
app.listen(PORT, () => {
  console.log("listening on port", PORT)
})
