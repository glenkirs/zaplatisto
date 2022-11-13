const tableName = 'orders';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn(tableName, 'service', {type: Sequelize.INTEGER.UNSIGNED});
  await queryInterface.changeColumn(tableName, 'plan', {type: Sequelize.INTEGER.UNSIGNED});
  await queryInterface.changeColumn(tableName, 'user', {type: Sequelize.INTEGER.UNSIGNED});
  await queryInterface.changeColumn(tableName, 'product', {type: Sequelize.INTEGER.UNSIGNED});

  await queryInterface.addConstraint(tableName, {
    type: 'FOREIGN KEY',
    fields: ['service'], 
    name: 'fk_orders_services',
    references: {
      table: 'services',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'no action',
  });
  await queryInterface.addConstraint(tableName, {
    type: 'FOREIGN KEY',
    fields: ['plan'],
    name: 'fk_orders_plans',
    references: {
      table: 'plans',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'no action',
  });
  await queryInterface.addConstraint(tableName, {
    type: 'FOREIGN KEY',
    fields: ['product'], 
    name: 'fk_orders_products',
    references: {
      table: 'products',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'no action',
  });
  await queryInterface.addConstraint(tableName, {
    type: 'FOREIGN KEY',
    fields: ['user'], 
    name: 'fk_orders_users',
    references: {
      table: 'users',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'no action',
  });
  await queryInterface.addColumn(tableName, 'options', {
    type: Sequelize.JSON,
    TransformStreamDefaultController: [],
    default: [],
    allowNull: false,
    after: 'plan'
  });
};

const down = async (queryInterface) => {
  await queryInterface.removeConstraint('products', 'fk_orders_services');
  await queryInterface.removeConstraint('plans', 'fk_orders_plans');
  await queryInterface.removeConstraint('plans', 'fk_orders_products');
  await queryInterface.removeConstraint('plans', 'fk_orders_users');
};

module.exports = {
  up,
  down,
};
