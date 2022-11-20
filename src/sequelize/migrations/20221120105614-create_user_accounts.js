const tableName = 'user_accounts';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER.UNSIGNED,
    },
    login: {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true,
    },
    service: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      default: null,
      primaryKey: true
    },
    user: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      default: null,
      primaryKey: true
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    }
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  });

  await queryInterface.addIndex(tableName, ['id', 'service', 'user']);
  await queryInterface.addConstraint(tableName, {
    type: 'FOREIGN KEY',
    fields: ['service'], 
    name: 'fk_user_accounts_services',
    references: {
      table: 'services',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'no action',
  });
  await queryInterface.addConstraint(tableName, {
    type: 'FOREIGN KEY',
    fields: ['user'], 
    name: 'fk_user_accounts_users',
    references: {
      table: 'users',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'no action',
  });
};

const down = async (queryInterface) => {
  await queryInterface.dropTable(tableName);
};

module.exports = {
  up,
  down,
};
