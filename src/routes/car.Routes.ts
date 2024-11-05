import { Router } from 'express'
import CarroRepository from '../repositories/carros.repositorie.js'
import CarroService from '../services/carros.service.js'
import CarroController from '../controllers/carro.controller.js'
import privateRoute from '../middlewares/auth.middlewere.js'

const carroRouter = Router()

const carroRepositorie = new CarroRepository()
const carroService = new CarroService(carroRepositorie)
const carroController = new CarroController(carroService)

carroRouter.post('/', privateRoute, async (req, res, next) => {
  try {
    await carroController.carroCreate(req, res, next)
  } catch (error) {
    next(error)
  }
})

carroRouter.get('/:id', privateRoute, async (req, res, next) => {
  try {
    await carroController.findCarroId(req, res, next)
  } catch (error) {
    next(error)
  }
})

carroRouter.get('/', privateRoute, async (req, res, next) => {
  try {
    await carroController.findCarros(req, res, next)
  } catch (error) {
    next(error)
  }
})

carroRouter.patch('/:id', privateRoute, async (req, res, next) => {
  try {
    await carroController.deleteCarro(req, res, next)
  } catch (error) {
    next(error)
  }
})

carroRouter.delete('/:id', privateRoute, async (req, res, next) => {
  try {
    await carroController.deleteCarro(req, res, next)
  } catch (error) {
    next(error)
  }
})

export default carroRouter
