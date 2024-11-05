import { where } from 'sequelize'
import EStatusCarro from '../definitions/pedidos.def/ECarro.js'
import Carro from '../models/Carro.js'

class CarroRepository {
  public async findCarroId(id: string): Promise<Carro | null> {
    try {
      const carro = await Carro.findOne({ where: { id } })
      return carro
    } catch (error) {
      throw error
    }
  }

  public async createCar(carroData: any): Promise<Carro> {
    try {
      const carro = await Carro.create(carroData)
      return carro
    } catch (error) {
      throw error
    }
  }

  public async findCars(): Promise<Carro[] | null> {
    try {
      const carros = await Carro.findAll()
      return carros
    } catch (error) {
      throw error
    }
  }

  public async updateCar(
    id: string,
    dadosAtualizados: {
      marca?: string
      modelo?: string
      ano?: number
      km?: number
      items?: Record<string, string>
      placa?: string
      valorDiaria?: number
      status?: EStatusCarro
    }
  ): Promise<Carro | null> {
    try {
      const [affectedRows] = await Carro.update(dadosAtualizados, {
        where: { id },
        returning: true
      })

      if (affectedRows === 0) {
        return null
      }

      const carroAtualizado = await Carro.findOne({ where: { id } })

      return carroAtualizado
    } catch (error) {
      throw error
    }
  }

  public async deleteCar(id: string): Promise<Carro | null> {
    try {
      const carExists = await this.findCarroId(id);

      if (!carExists) {
        return null;
      }

      const statusAtualizado = new Date();

      // Corrigido para passar o campo `dataDeExclusao` como um objeto
      await Carro.update(
        { dataDeExclusao: statusAtualizado }, // Objeto com o campo a ser atualizado
        { where: { id } }
      );

      // Retorna o carro atualizado, que agora inclui a `dataDeExclusao`
      carExists.dataDeExclusao = statusAtualizado;
      return carExists;

    } catch (error) {
      throw error;
    }
  }
}

export default CarroRepository
