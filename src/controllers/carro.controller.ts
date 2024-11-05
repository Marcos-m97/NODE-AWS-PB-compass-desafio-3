import Carro from '../models/Carro.js'
import CarroService from '../services/carros.service.js'
import { Request, Response, NextFunction } from 'express'

class CarroController {
  private carroService: CarroService
  constructor(carroService: CarroService) {
    this.carroService = carroService
  }

  public async carroCreate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const carroData: Partial<Carro> = req.body
      const carro = await this.carroService.createCarro(carroData)
      return res.status(201).json(carro)
    } catch (error) {
      throw error
    }
  }

  public async findCarroId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = req.params
      const findCarro = await this.carroService.findCarroId(id)
      return res.status(200).json(findCarro)
    } catch (error) {
      throw error
    }
  }

  public async findCarros(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const findCarros = await this.carroService.findCarros()
      return res.status(200).json(findCarros)
    } catch (error) {
      throw error
    }
  }

  public async deleteCarro(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = req.params

      const deleteCarro = await this.carroService.deleteCarro(id)

      return res.status(200).json(deleteCarro)
    } catch (error) {
      throw error
    }
  }
}

export default CarroController
