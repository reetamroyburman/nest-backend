import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../../../configurations/sequelize';
import { TableNames } from '../../../../../shared/constants/tableNames';
// import { sequelize } from '../../../configurations/sequelize';
// import { TableNames } from '../../../shared/constants/tableNames';

/**
 * Attributes
 */
export interface IUrlAttributes {
  id: number;
  original_url: string;
  short_code: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Creation attributes
 */
export interface IUrlCreationAttributes
  extends Optional<IUrlAttributes, 'id' | 'short_code' | 'is_active' | 'created_at' | 'updated_at'> {}

/**
 * Model
 */
const Url = sequelize.define<Model<IUrlAttributes, IUrlCreationAttributes>>(
  TableNames.URLS,
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    original_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    short_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
  },
  {
    tableName: TableNames.URLS,
    timestamps: false,
    underscored: true,
  }
);

export { Url };
