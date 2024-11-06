
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db.js';

interface UserAttributes {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  createdAt?: Date;
  deletedAt?: Date | null;
}


class User extends Model<UserAttributes> {
  public id?: string;
  public fullName!: string;
  public email!: string;
  public password!: string;
  public createdAt?: Date;
  public deletedAt?: Date | null;

  
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,    
      allowNull: false,  
      primaryKey: true,  
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, 
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, 
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize, 
    tableName: 'users',
    timestamps: false, 
  }
);

export { User };