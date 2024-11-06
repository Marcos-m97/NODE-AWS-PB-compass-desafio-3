import { carUpdateType } from '../definitions/cars.def/cars.types.js'
import { AppErrors } from '../middlewares/errorMiddlewere.js'
import Carro from '../models/Carro.js'
import CarroRepository from '../repositories/carros.repositorie.js'

class CarroService {
  private carroRepository: CarroRepository
  constructor(carroRepository: CarroRepository) {
    this.carroRepository = carroRepository
  }

  
  public async createCarro(carroData: Partial<Carro>): Promise<Carro | null> {
    try {
      const createCar = await this.carroRepository.createCar(carroData)
      return createCar
    } catch (error) {
      throw error
    }
  }

  public async findCarroId(id: string): Promise<Carro | null> {
    try {
      const findCarroId = await this.carroRepository.findCarroId(id)
      return findCarroId
    } catch (error) {
      throw error
    }
  }

  public async findCarros(): Promise<Carro[] | null> {
    try {
      const findCarros = await this.carroRepository.findCars()
      return findCarros
    } catch (error) {
      throw error
    }
  }


   public async atualizarCarro(id: string, updateData:carUpdateType): Promise<Carro> {
    try {
      const updatedCar = await this.carroRepository.updateCar(id,updateData)
      if (!updatedCar) {
        throw new AppErrors('Car not found.', 404)
      }
      return updatedCar
    } catch (error) {
      throw error
    }
  }

  public async deleteCarro(id: string): Promise<Carro> {
    try {
      const deleteCarro = await this.carroRepository.deleteCar(id)
      if (!deleteCarro) {
        throw new AppErrors('Car not found.', 404)
      }
      return deleteCarro
    } catch (error) {
      throw error
    }
  }
}

export default CarroService
