'use strict';

const USERS_TABLE = 'users';
const ADDRESSES_TABLE = 'user_addresses';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        ADDRESSES_TABLE,
        {
          id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          user_id: {
            type: Sequelize.BIGINT, // must match users.id
            allowNull: false,
            references: {
              model: USERS_TABLE,
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },

          // Address fields
          address_line1: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          address_line2: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          city: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          state: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          postal_code: {
            type: Sequelize.STRING(20),
            allowNull: false,
          },
          country: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },

          // Additional fields like big tech companies
          address_type: {
            type: Sequelize.ENUM(
              'home',
              'office',
              'billing',
              'shipping',
              'headquarters',
              'branch',
              'warehouse',
              'remote',
              'registered_office',
              'legal_address',
              'tax_address',
              'operations_center',
              'fulfillment_center',
              'support_center',
              'manufacturing_site',
              'data_center'
            ),
            defaultValue: 'home',
            allowNull: false,
          },
          is_primary: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },

          // Optional extra metadata fields
          latitude: {
            type: Sequelize.DECIMAL(10, 7),
            allowNull: true,
          },
          longitude: {
            type: Sequelize.DECIMAL(10, 7),
            allowNull: true,
          },

          user_type: {
            type: Sequelize.ENUM('professional', 'business', 'personal'),
            defaultValue: 'professional',
          },

          created_by: {
            type: Sequelize.BIGINT,
            allowNull: true,
            references: { model: USERS_TABLE, key: 'id' },
            onUpdate: 'CASCADE'
          },
          updated_by: {
            type: Sequelize.BIGINT,
            allowNull: true,
            references: { model: USERS_TABLE, key: 'id' },
            onUpdate: 'CASCADE'
          },

          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
          },
          deleted_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
        { transaction }
      );
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable(ADDRESSES_TABLE, { transaction });
    });
  },
};
