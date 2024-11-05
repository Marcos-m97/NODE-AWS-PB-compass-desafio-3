import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false

  }
)

export async function connectDB() {
  try {
    await sequelize.authenticate()
    console.log('|DB| Conectado com sucesso! 🎲')
    // await sequelize.sync()
    //await sequelize.sync({ force: true })
    //await sequelize.sync({ alter: true });
  } catch (err) {
    throw err
  }
}

export default sequelize
