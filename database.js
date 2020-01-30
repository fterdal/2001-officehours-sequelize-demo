/**
 * Creating models
 * Creating entities
 * Adding relationships
 * Querying
 */

const Sequelize = require("sequelize")
const db = new Sequelize("postgres://localhost:5432/hawtdogs", {
  logging: false
})

const Dog = db.define("dog", {
  name: Sequelize.STRING,
  quality: Sequelize.INTEGER
})

const Topping = db.define("topping", {
  name: Sequelize.STRING,
  vegetarian: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

// One To Many
Topping.belongsTo(Dog)
Dog.hasMany(Topping)

async function seedDatabase() {
  await db.sync({ force: true })

  // Do stuff
  const chicago = await Dog.create({ name: "chicago-style", quality: 10 })
  const newYork = await Dog.create({ name: "newyork-style", quality: 1 })

  const celery = await Topping.create({ name: "celery salt", vegetarian: true })
  const ketchup = await Topping.create({ name: "ketchup", vegetarian: true })
  const sportPepper = await Topping.create({
    name: "sport pepper",
    vegetarian: true
  })
  const bacon = await Topping.create({ name: "bacon" })

  // Magic methods
  // console.log(chicago.__proto__) // Cool MAgic Method Hack
  await chicago.addTopping(celery)
  await chicago.addTopping(sportPepper)
  await newYork.addTopping(ketchup)

  // findAll and findByPk are very common
  const toppingsOnChicagoDogs = await Topping.findAll({
    include: [{ model: Dog }],
    where: {
      dogId: 1
    },
    raw: true
  })
  console.log(toppingsOnChicagoDogs)

  await db.close()
}
seedDatabase()
