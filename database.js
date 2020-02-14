const Sequelize = require("sequelize")
const db = new Sequelize("postgres://localhost:5432/dmv", {
  logging: false
})

const Car = db.define("car", {
  modelName: Sequelize.STRING
})

const Owner = db.define("owner", {
  name: Sequelize.STRING
})

const OwnershipRecords = db.define("ownership_records", {
  purchaseDate: Sequelize.DATEONLY
})

// Many-to-Many Relationship
Car.belongsToMany(Owner, { through: OwnershipRecords })
Owner.belongsToMany(Car, { through: OwnershipRecords })

const seedCars = [
  { modelName: "Prius" },
  { modelName: "Ferrari" },
  { modelName: "Pickup Truck" }
]

const seedOwners = [{ name: "Priti" }, { name: "Justin" }, { name: "Finn" }]

async function seed() {
  await db.sync({ force: true })

  // const prius = await Car.create({ modelName: "Prius" })
  // const ferrari = await Car.create({ modelName: "Ferrari" })
  // const pickupTruck = await Car.create({ modelName: "Pickup Truck" })
  // const priti = await Owner.create({ name: "Priti" })
  // const justin = await Owner.create({ name: "Justin" })
  // const finn = await Owner.create({ name: "Finn" })
  const [prius, ferrari, pickupTruck] = await Car.bulkCreate(seedCars, {
    returning: true
  })
  const [priti, justin, finn] = await Owner.bulkCreate(seedOwners, {
    returning: true
  })

  // const prius = cars[0]
  // const ferrari = cars[1]
  // const pickupTruck = cars[2]

  // const priti = owners[0]
  // const justin = owners[1]
  // const finn = owners[2]

  // console.log(prius.__proto__) // shows the magic methods
  await prius.addOwner(finn)
  await justin.addCar(ferrari)
  await justin.addCar(pickupTruck)

  // Not recommended, but works
  await OwnershipRecords.create({ ownerId: priti.id, carId: pickupTruck.id })

  // Eager Loading Example
  const justinWithCars = await Owner.findByPk(2, {
    include: [{ model: Car }]
  })
  console.log(justinWithCars.cars)

  await db.close()
}
seed()
