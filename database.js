const Sequelize = require("sequelize")

/**
 * Sequelize:
 * Sequelize Hooks
 * Class / Instance methods
 *
 * Express:
 * The four basic methods: GET, POST, PUT, DELETE
 * How to set response status: 200, 201, 404, 500
 * Query Params
 * routers (vs app)
 */

const db = new Sequelize("postgres://localhost:5432/dogs", {
  logging: false
})

const Dog = db.define("dog", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  breed: Sequelize.ENUM("retriever", "corgi", "labradoodle"),
  favoriteToy: Sequelize.STRING
})

const Owner = db.define("owner", {
  name: Sequelize.STRING
})

// One to One
Dog.belongsTo(Owner)
Owner.hasOne(Dog)

async function seedDatabase() {
  await db.sync({ force: true })

  // console.log(Dog)
  await Dog.create(
    {
      name: "Fido",
      breed: "retriever",
      favoriteToy: "stick"
    }
  )
  const fido = await Dog.findAll({
    where: { name: "Fido" },
    raw: true
  })
  console.log(fido)

  // await db.close()
}
seedDatabase()

module.exports = { Dog, Owner }
