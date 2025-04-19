
const USERS_TABLE = 'users'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Using a transaction is still good practice for safety
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        USERS_TABLE,
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          first_name: {
            type: Sequelize.STRING(50),
            allowNull: false,
          },
          last_name: {
            type: Sequelize.STRING(50),
            allowNull: false,
          },
          username: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true,
          },
          email: {
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: true,
          },
          phone_number: {
            type: Sequelize.STRING(20),
            allowNull: true,
            unique: true,
          },
          password_hash: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          role: {
            type: Sequelize.ENUM('user', 'admin', 'super_admin'),
            defaultValue: 'user',
            allowNull: false,
          },
          is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
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
      await queryInterface.dropTable(USERS_TABLE, { transaction })
    });
  },
};
