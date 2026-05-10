'use strict';

const USERS_TABLE = 'users';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {

      // Add failed_login_attempts column
      await queryInterface.addColumn(
        USERS_TABLE,
        'failed_login_attempts',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );

      // Add account_locked_until column
      await queryInterface.addColumn(
        USERS_TABLE,
        'account_locked_until',
        {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
        },
        { transaction }
      );

    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.removeColumn(
        USERS_TABLE,
        'failed_login_attempts',
        { transaction }
      );

      await queryInterface.removeColumn(
        USERS_TABLE,
        'account_locked_until',
        { transaction }
      );

    });
  },
};