import { Model, DataTypes } from 'sequelize'

import sequelize from '../db.js'

// import interfaces

import ICliente from '../interfaces/ICliente.js'

import { UUID } from 'crypto'

class Cliente extends Model<ICliente> {
  public id!: UUID

  public nome!: string

  public dataNascimento!: Date

  public cpf!: string

  public email!: string

  public telefone!: string

  public dataCadastro!: Date

  public dataExclusao!: Date
}

Cliente.init(
  {
    id: {
      type: DataTypes.UUID,

      defaultValue: DataTypes.UUIDV4,

      primaryKey: true
    },

    nome: {
      type: DataTypes.STRING,

      allowNull: false
    },

    dataNascimento: {
      type: DataTypes.DATEONLY,

      allowNull: false
    },

    cpf: {
      type: DataTypes.STRING,

      allowNull: false
    },

    email: {
      type: DataTypes.STRING,

      allowNull: false,

      unique: true
    },

    telefone: {
      type: DataTypes.STRING,

      allowNull: false
    },

    dataCadastro: {
      type: DataTypes.DATE,

      allowNull: false,

      defaultValue: DataTypes.NOW
    },

    dataExclusao: {
      type: DataTypes.DATE,

      allowNull: true,

      defaultValue: null
    }
  },

  { sequelize, modelName: 'Cliente', tableName: 'clientes', timestamps: false }
)

export default Cliente
