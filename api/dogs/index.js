const express  = require("express")
const { Dog } = require("../../database")

const router = express.Router()

router.get("/", async (req, res, next) => {
  const dogs = await Dog.findAll()
  res.json(dogs)
})

router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id)
  const dogs = await Dog.findByPk(id)
  res.json(dogs)
})

module.exports = router
