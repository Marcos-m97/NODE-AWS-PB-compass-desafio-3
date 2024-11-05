import { Model, DataTypes } from 'sequelize'
import sequelize from '../db.js'

// import interfaces
import ICarro from '../definitions/pedidos.interfaces/ICarros.js'
import EStatusCarro from '../definitions/pedidos.enums/ECarro.js'

class Carro extends Model<ICarro> {
  public id!: string
  public placa!: string
  public marca!: string
  public modelo!: string
  public ano!: number
  public km!: number
  public items!: Record<string, string>
  public valorDiaria!: number
  public dataCadastro!: Date
  public status!: EStatusCarro
}

Carro.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    km: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false
    },
    placa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    valorDiaria: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    dataCadastro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now
    },
    status: {
      type: DataTypes.ENUM('Ativo', 'Inativo', 'Excluido'),
      allowNull: false,
      defaultValue: 'Ativo'
    }
  },
  {
    sequelize,
    modelName: 'Carro',
    tableName: 'carros',
    timestamps: false
  }
)

export default Carro
