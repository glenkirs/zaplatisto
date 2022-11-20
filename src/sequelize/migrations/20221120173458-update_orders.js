const tableName = 'orders';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn(tableName, 'price', {
    type: Sequelize.JSON,
    TransformStreamDefaultController: {},
    default: {},
    allowNull: true,
    after: 'options'
  });
  await queryInterface.addColumn(tableName, 'members', {
    type: Sequelize.INTEGER,
    default: 0,
    allowNull: true,
    after: 'price'
  });
  await queryInterface.addColumn(tableName, 'user_account', {
    type: Sequelize.INTEGER.UNSIGNED,
    default: 0,
    allowNull: true,
    after: 'user'
  });
  await queryInterface.addConstraint(tableName, {
    type: 'FOREIGN KEY',
    fields: ['user_account'], 
    name: 'fk_orders_user_account',
    references: {
      table: 'user_accounts',
      field: 'id',
    },
    onDelete: 'no action',
    onUpdate: 'no action',
  });
};

const down = async (queryInterface) => {
  await queryInterface.removeConstraint(tableName, 'fk_orders_user_account');
  await queryInterface.removeColumn(tableName, 'price');
  await queryInterface.removeColumn(tableName, 'members');
  await queryInterface.removeColumn(tableName, 'user_account');
};

module.exports = {
  up,
  down,
};
