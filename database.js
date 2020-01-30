const Sequelize = require("sequelize")

const db = new Sequelize("postgres://localhost:5432/hot-dogs", {
  logging: false
})

// Each of this is a "Model", which corresponds to a "table" in Postgres
const HotDog = db.define("hotdog", {
  name: Sequelize.STRING,
})
const Sausage = db.define("sausage", {
  name: Sequelize.STRING,
  vegetarian: Sequelize.BOOLEAN
})
const Bun = db.define("bun", {
  name: Sequelize.STRING,
  glutenFree: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
})
const Topping = db.define("topping", {
  name: Sequelize.STRING
})

// One To One
HotDog.hasOne(Sausage)
Sausage.belongsTo(HotDog)

// One To Many
HotDog.hasMany(Topping)
Topping.belongsTo(HotDog)

async function seedDatabase() {
  await db.sync({ force: true }) // connects to the database

  await Sausage.create({ name: "frank", vegetarian: false })
  await Bun.create({ name: "standard" })

  const chicagoStyle = await HotDog.create({ name: "chicago-style" })
  // console.log(chicagoStyle.__proto__) // List the magic methods

  const celery = await Topping.create({ name: "celery salt" })
  const tomato = await Topping.create({ name: "tomato" })
  await chicagoStyle.addTopping(celery)
  await chicagoStyle.addTopping(tomato)

  // const chicagoStyleWithToppings = HotDog.findByPk(1) // Finds one hot dog
  const chicagoStyleWithToppings = await HotDog.findAll({
    where: { name: "chicago-style" },
    raw: true
  })
  console.log(chicagoStyleWithToppings)

  await db.close() // close the database
}
seedDatabase()
