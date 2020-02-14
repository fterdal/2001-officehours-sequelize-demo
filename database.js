const Sequelize = require("sequelize")
const db = new Sequelize("postgres://localhost:5432/menu", {
  logging: false
})

const Entree = db.define("entree", {
  name: Sequelize.STRING
})

const Ingredient = db.define("ingredient", {
  name: Sequelize.STRING
})

Entree.belongsToMany(Ingredient, { through: "recipe" })
Ingredient.belongsToMany(Entree, { through: "recipe" })

async function seed() {
  await db.sync({ force: true })

  const [carbonara, spaghetti, ravioli] = await Entree.bulkCreate([
    { name: "Carbonara" },
    { name: "Spaghetti" },
    { name: "Ravioli" }
  ])

  const [linguini, marinara, sausage] = await Ingredient.bulkCreate([
    { name: "linguini" },
    { name: "marinara" },
    { name: "sausage" }
  ])

  // console.log(linguini.__proto__)
  // console.log(carbonara.__proto__)
  // console.log(Entree.__proto__)

  await carbonara.addIngredient(linguini), // magic method
  await carbonara.addIngredient(sausage) // magic method
  await marinara.addEntree(spaghetti) // magic method

  // await Promise.all([
  //   carbonara.addIngredient(linguini), // magic method
  //   carbonara.addIngredient(sausage) // magic method
  // ])

  // Eager loading
  const eagerLoadCarbonara = await Entree.findByPk(1, {
    include: [Ingredient]
  })
  console.log(eagerLoadCarbonara.ingredients)

  // All about them magic methods
  // const retrievedCarbonara = await Entree.findByPk(1)
  // const carbonaraIngredients = await retrievedCarbonara.getIngredients()
  // console.log(carbonaraIngredients)

  await db.close()
}
seed()
