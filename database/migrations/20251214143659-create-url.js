'use strict';
const URL_TABLE = 'urls';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(URL_TABLE, {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      original_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      short_code: {
        type: Sequelize.STRING(10),
        allowNull: true,
        unique: true,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Performance index for redirects
    await queryInterface.addIndex('urls', ['short_code'], {
      name: 'idx_urls_short_code',
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('urls');
  },
};
