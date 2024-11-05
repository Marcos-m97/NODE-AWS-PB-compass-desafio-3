import { Router } from 'express'
import CarroRepository from '../repositories/carros.repositorie.js'
import CarroService from '../services/carros.service.js'
import CarroController from '../controllers/carro.controller.js'

const carroRouter = Router()

const carroRepositorie = new CarroRepository()
const carroService = new CarroService(carroRepositorie)
const carroController = new CarroController(carroService)

carroRouter.post('/', async (req, res, next) => {
  try {
    await carroController.carroCreate(req, res, next)
  } catch (error) {
    next(error)
  }
})

carroRouter.get('/:id', async (req, res, next) => {
  try {
    await carroController.findCarroId(req, res, next)
  } catch (error) {
    next(error)
  }
})

carroRouter.get('/', async (req, res, next) => {
  try {
    await carroController.findCarros(req, res, next)
  } catch (error) {
    next(error)
  }
})

// carroRouter.put('/:id', async (req, res, next) => {
//   try {
//     await carroController.deleteCarro(req, res, next)
//   } catch (error) {
//     next(error)
//   }
// })

export default carroRouter
