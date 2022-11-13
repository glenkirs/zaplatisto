const tableName = 'plans_options';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER.UNSIGNED,
    },
    name: {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true,
    },
    price: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    currency: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 0
    },
    plan: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      default: null,
      primaryKey: true
    },
    is_active: {
      type: Sequelize.INTEGER,
      allowNull: true,
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

  await queryInterface.addIndex(tableName, ['id', 'plan', 'name']);
  await queryInterface.addConstraint(tableName, {
    type: 'FOREIGN KEY',
    fields: ['plan'], 
    name: 'fk_plans_options_plans',
    references: {
      table: 'plans',
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
