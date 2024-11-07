import { Sequelize } from 'sequelize'


// Configuração temporária para SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Define o arquivo onde o SQLite armazenará os dados
  logging: false
})

export async function connectDB() {
  try {
    await sequelize.authenticate()
    console.log('|DB| Conectado com sucesso! 🎲')

    // Sincronização com o banco de dados
    await sequelize.sync({ force: true }) // Recria as tabelas toda vez, ideal para protótipos
  } catch (err) {
    throw err
  }
}
export default sequelize

/* import { Sequelize } from 'sequelize'

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
*/
