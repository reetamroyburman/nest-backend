import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../../../configurations/sequelize';
import { TableNames } from '../../../../../shared/constants/tableNames';
import { Users } from './IUsers';

interface IUserAddresses {
  id: number;
  user_id: number;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: 'home' | 'office' | 'billing' | 'shipping' | 'headquarters' | 'branch' | 'warehouse' | 'remote' | 'registered_office' | 'legal_address' | 'tax_address' | 'operations_center' | 'fulfillment_center' | 'support_center' | 'manufacturing_site' | 'data_center';
  is_primary?: boolean;
  latitude?: number;
  longitude?: number;
  user_type?: 'professional' | 'business' | 'personal';
  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// Optional fields for creation
interface IUserAddressesCreation extends Optional<IUserAddresses, 'id' | 'address_line2' | 'is_primary' | 'latitude' | 'longitude' | 'user_type' | 'created_by' | 'updated_by' | 'created_at' | 'updated_at' | 'deleted_at'> {}

const UserAddress = sequelize.define<Model<IUserAddresses, IUserAddressesCreation>>(
  TableNames.USERS_ADDRESSES,
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: TableNames.USERS,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    address_line1: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address_line2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address_type: {
      type: DataTypes.ENUM(
        'home','office','billing','shipping','headquarters','branch','warehouse','remote','registered_office','legal_address','tax_address','operations_center','fulfillment_center','support_center','manufacturing_site','data_center'
      ),
      defaultValue: 'home',
      allowNull: false,
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    user_type: {
      type: DataTypes.ENUM('professional', 'business', 'personal'),
      defaultValue: 'professional',
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
    tableName: TableNames.USERS_ADDRESSES,
    timestamps: false,
    paranoid: true,
    deletedAt: 'deleted_at',
    underscored: true,
  }
);

// UserAddress.belongsTo(Users, {
//   as: 'user',
//   foreignKey: 'user_id'
// });

// Users.hasMany(UserAddress, {
//   as: 'user_addresses',
//   foreignKey: 'user_id'
// });


export { UserAddress, IUserAddresses, IUserAddressesCreation };
