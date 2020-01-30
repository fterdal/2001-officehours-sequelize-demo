const Sequelize = require("sequelize")

const db = new Sequelize("postgres://localhost:5432/sandwiches", {
  logging: false
})

const Sandwich = db.define("sandwich", {
  name: Sequelize.STRING
})

const Topping = db.define("topping", {
  name: Sequelize.STRING,
  vegetarian: Sequelize.BOOLEAN
})

// One to Many
Topping.belongsTo(Sandwich)
Sandwich.hasMany(Topping)

async function seedDatabase() {
  await db.sync({ force: true })
  const blt = await Sandwich.create({ name: "BLT" })
  const bacon = await Topping.create({ name: "bacon", vegetarian: false })
  const lettuce = await Topping.create({ name: "lettuce", vegetarian: true })
  const bltIngredients = await blt.getToppings()
  // console.log("bltIngredients:" , bltIngredients)
  // console.log('BLT magic methods', blt.__proto__)
  await blt.addTopping(bacon)
  await blt.addTopping(lettuce)

  const plainBacon = await Topping.findAll({
    where: {
      name: "bacon"
    },
    plain: true,
    returning: true
  })
  // console.log(Array.isArray(plainBacon))

  const menu = await Sandwich.bulkCreate(
    [{ name: "Reuben" }, { name: "Meatball Sub" }, { name: "Tuna Melt" }],
    { returning: true }
  )
  const updatedMenu = await Sandwich.update(
    { name: "Corned Beef" },
    {
      where: {  },
      returning: true
    }
  )
  console.log(updatedMenu)

  await db.close()
}
seedDatabase()
