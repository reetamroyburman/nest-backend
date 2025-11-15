'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const USERS_TABLE = 'users';
const ADDRESSES_TABLE = 'user_addresses';

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      // ---------- 1️⃣ Insert Users ----------
      const users = [];
      const roles = ['user', 'admin', 'super_admin'];

      const firstNames = [
        'John', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava',
        'Sophia', 'James', 'Mia', 'Lucas', 'Charlotte', 'Mason',
        'Isabella', 'Benjamin', 'Amelia', 'Elijah', 'Harper',
        'Daniel', 'Chloe', 'Henry', 'Evelyn', 'Alexander', 'Grace',
        'Samuel', 'Victoria', 'Nathan', 'Lily', 'Ryan', 'Ella'
      ];

      const lastNames = [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
        'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
        'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
        'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
        'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez',
        'Clark', 'Ramirez', 'Lewis', 'Robinson'
      ];

      const hashedPassword = await bcrypt.hash('Password123!', 10);

      for (let i = 0; i < 30; i++) {
        const first_name = firstNames[i % firstNames.length];
        const last_name = lastNames[i % lastNames.length];

        users.push({
          uuid: uuidv4(),
          first_name,
          last_name,
          username: `${first_name.toLowerCase()}.${last_name.toLowerCase()}${i}`,
          email: `${first_name.toLowerCase()}.${last_name.toLowerCase()}${i}@example.com`,
          phone_number: `+1000000${String(i).padStart(4, '0')}`,
          password_hash: hashedPassword,
          role: roles[i % roles.length],
          is_active: true,
          created_by: null,
          updated_by: null,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        });
      }

      // Insert users
      await queryInterface.bulkInsert(USERS_TABLE, users, { transaction });

      // Fetch inserted users with IDs (MySQL/Postgres safe)
      const insertedUsers = await queryInterface.sequelize.query(
        `SELECT id, uuid, role, username FROM ${USERS_TABLE} ORDER BY id DESC LIMIT 30;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction }
      );

      // ---------- 2️⃣ Insert Addresses ----------
      const addressTypes = [
        'home', 'office', 'billing', 'shipping', 'headquarters',
        'branch', 'warehouse', 'remote', 'registered_office',
        'legal_address', 'tax_address', 'operations_center',
        'fulfillment_center', 'support_center',
        'manufacturing_site', 'data_center'
      ];

      const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
      const states = ['NY', 'CA', 'IL', 'TX', 'AZ'];
      const countries = ['USA'];

      const userTypesMapping = {
        user: ['professional', 'business', 'personal'],
        admin: ['professional', 'business'],
        super_admin: ['professional', 'business'],
      };

      const addresses = [];

      insertedUsers.forEach((u, index) => {
        const numOfAddresses = Math.random() > 0.5 ? 2 : 1;

        for (let a = 0; a < numOfAddresses; a++) {
          const types = userTypesMapping[u.role] || ['professional'];
          const user_type = types[Math.floor(Math.random() * types.length)];

          addresses.push({
            user_id: u.id, // auto-increment numeric ID
            address_line1: `Address Line ${a + 1} for ${u.username}`,
            address_line2: null,
            city: cities[index % cities.length],
            state: states[index % states.length],
            postal_code: `9000${index}`,
            country: countries[0],
            address_type: addressTypes[(index + a) % addressTypes.length],
            is_primary: a === 0,
            latitude: 40.7128 + Math.random(),
            longitude: -74.0060 + Math.random(),
            user_type,
            created_by: null,
            updated_by: null,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null,
          });
        }
      });

      await queryInterface.bulkInsert(ADDRESSES_TABLE, addresses, { transaction });
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkDelete(ADDRESSES_TABLE, null, { transaction });
      await queryInterface.bulkDelete(USERS_TABLE, null, { transaction });
    });
  },
};
