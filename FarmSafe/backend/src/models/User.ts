import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'farmer' | 'admin';
  location?: string;
  farmSize?: number;
  crops?: string;
  profilePicture?: string;
  phoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'farmer' | 'admin';
  public location?: string;
  public farmSize?: number;
  public crops?: string;
  public profilePicture?: string;
  public phoneNumber?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('farmer', 'admin'),
      allowNull: false,
      defaultValue: 'farmer',
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    farmSize: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    crops: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

export default User;
