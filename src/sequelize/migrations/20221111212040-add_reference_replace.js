const up = async (queryInterface, Sequelize) => {
  await queryInterface.removeConstraint('products', 'fk_products_services');
  await queryInterface.removeConstraint('plans', 'fk_plans_services');
  await queryInterface.removeConstraint('plans', 'fk_plans_product');

  await queryInterface.addConstraint('products', {
    type: 'FOREIGN KEY',
    fields: ['service'], 
    name: 'fk_products_services',
    references: {
      table: 'services',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'no action',
  });
  await queryInterface.addConstraint('plans', {
    type: 'FOREIGN KEY',
    fields: ['service'],
    name: 'fk_plans_services',
    references: {
      table: 'services',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'no action',
  });
  await queryInterface.addConstraint('plans', {
    type: 'FOREIGN KEY',
    fields: ['product'], 
    name: 'fk_plans_product',
    references: {
      table: 'products',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'no action',
  });
};

const down = async (queryInterface) => {
  await queryInterface.removeConstraint('products', 'fk_products_services');
  await queryInterface.removeConstraint('plans', 'fk_plans_services');
  await queryInterface.removeConstraint('plans', 'fk_plans_product');
};

module.exports = {
  up,
  down,
};
