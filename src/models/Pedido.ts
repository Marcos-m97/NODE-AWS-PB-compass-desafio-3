import { Model, DataTypes } from 'sequelize'

import sequelize from '../db.js'

// importando cliente
import Cliente from './Cliente.js'
import Carro from './Carro.js'

// interfaces
import IPedido from '../definitions/pedidos.def/IPedidos.js'
import EStatusPedido from '../definitions/pedidos.def/EPedido.js'
import { UUID } from 'crypto'

export type pedidoInput = {
  clienteId: number
  carroId: number
}

class Pedido extends Model<IPedido> {
  public id!: UUID
  public clienteId!: UUID
  public carroId!: UUID
  public dataPedido!: Date
  public statusPedido!: EStatusPedido
  public cep!: string
  public cidade!: string | null
  public uf!: string | null
  public taxaLocacao!: number | null
  public valorTotal!: number | null
  public dataHoraInicial!: Date
  public dataHoraFinal!: Date
  public dataCancelamento!: Date
  public dataFechamento!: Date
  public valorMulta!: number
}

Pedido.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    clienteId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Cliente,
        key: 'id'
      }
    },
    carroId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Carro,
        key: 'id'
      }
    },
    dataPedido: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now
    },
    statusPedido: {
      type: DataTypes.ENUM('Aberto', 'Aprovado', 'Fechado', 'Cancelado'),
      allowNull: false,
      defaultValue: 'Aberto'
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    uf: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    taxaLocacao: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    valorTotal: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    dataHoraInicial: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    dataHoraFinal: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    dataCancelamento: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    dataFechamento: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    valorMulta: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    sequelize,
    modelName: 'Pedido',
    tableName: 'pedidos',
    timestamps: false
  }
)

Pedido.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' })
Cliente.hasMany(Pedido, { foreignKey: 'clienteId' })

Pedido.belongsTo(Carro, { foreignKey: 'carroId', as: 'carro' })
Carro.hasMany(Pedido, { foreignKey: 'carroId' })

export default Pedido
