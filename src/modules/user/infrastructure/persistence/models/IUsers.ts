import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../../../configurations/sequelize';
import { TableNames } from '../../../../../shared/constants/tableNames';
import { UserAddress } from './IUserAddresses';

// Define User attributes interface
interface IUserAttributes {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number?: string;
  password_hash: string;
  role: 'user' | 'admin' | 'super_admin';
  is_active?: boolean;
  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// For creation, some fields are optional
interface IUserCreationAttributes extends Optional<IUserAttributes, 'id' | 'uuid' | 'is_active' | 'created_by' | 'updated_by' | 'created_at' | 'updated_at' | 'deleted_at'> {}

const Users = sequelize.define<Model<IUserAttributes, IUserCreationAttributes>>(
  TableNames.USERS,
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'super_admin'),
      allowNull: false,
      defaultValue: 'user',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: TableNames.USERS,
    timestamps: false, // We already have custom timestamps
    paranoid: true, // For soft deletes
    deletedAt: 'deleted_at',
    underscored: true,
  }
);

Users.hasMany(UserAddress, {
  as: 'user_addresses',
  foreignKey: 'user_id'
});

UserAddress.belongsTo(Users, {
  as: 'user',
  foreignKey: 'user_id'
})

export { Users, IUserAttributes, IUserCreationAttributes };
