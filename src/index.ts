import 'dotenv/config'
import express from 'express'
import { connectDB } from './db.js'
import createSeed from './seeders/userSeed.js'
import './models/usermodel.js'
import errorMiddlewere from './middleweres/errorMiddlewere.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swaggerConfig.js'
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.Routes.js'
import clienteRouter from './routes/clientes.Routes.js'
import pedidoRouter from './routes/pedidoLocacaoRoutes.js'
import carroRouter from './routes/car.Routes.js'

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())

// rota de autenticação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/v1/login', authRouter)
app.use('/api/v1/clientes', clienteRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/pedidos', pedidoRouter)
app.use('/api/v1/carros', carroRouter)

app.use(errorMiddlewere)

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

async function startServer() {
  try {
    await connectDB()
    await createSeed()

    app.listen(port, function () {
      console.log(`|SERVER| Rodando na porta [${port}] 🎈`)
    })
  } catch (error) {
    console.log('error', error)
  }
}
startServer()
