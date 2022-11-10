const up = async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn('products', 'service', {type: Sequelize.INTEGER.UNSIGNED});
  await queryInterface.changeColumn('plans', 'service', {type: Sequelize.INTEGER.UNSIGNED});
  await queryInterface.changeColumn('plans', 'product', {type: Sequelize.INTEGER.UNSIGNED});

  await queryInterface.addIndex('products', ['id', 'service']);
  await queryInterface.addIndex('plans', ['service', 'product']);
  await queryInterface.addIndex('services', ['id']);

  await queryInterface.addConstraint('products', {
    type: 'FOREIGN KEY',
    fields: ['service'], 
    name: 'fk_products_services',
    references: {
      table: 'services',
      field: 'id',
    }
  });
  await queryInterface.addConstraint('plans', {
    type: 'FOREIGN KEY',
    fields: ['service'],
    name: 'fk_plans_services',
    references: {
      table: 'services',
      field: 'id',
    }
  });
  await queryInterface.addConstraint('plans', {
    type: 'FOREIGN KEY',
    fields: ['product'], 
    name: 'fk_plans_product',
    references: {
      table: 'products',
      field: 'id',
    }
  });
};

const down = async (queryInterface) => {
  await queryInterface.removeConstraint('products', 'fk_products_services');
  await queryInterface.removeConstraint('plans', 'fk_plans_services');
  await queryInterface.removeConstraint('plans', 'fk_plans_product');
  await queryInterface.removeIndex('products', ['id', 'service']);
  await queryInterface.removeIndex('plans', ['service', 'product']);
  await queryInterface.removeIndex('services', ['id']);
};

module.exports = {
  up,
  down,
};
