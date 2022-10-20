const tableName = 'plans';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn(tableName, 'title', { type: Sequelize.STRING, allowNull: true, defaultValue: null });
  await queryInterface.removeColumn(tableName, 'price');
  await queryInterface.removeColumn(tableName, 'sub_title');
  await queryInterface.removeColumn(tableName, 'descriptions');
  await queryInterface.addColumn(tableName, 'prices', {
    type: Sequelize.JSON,
    TransformStreamDefaultController: [],
    allowNull: false,
  });
  await queryInterface.renameColumn(tableName, 'billing', 'product');
  await queryInterface.changeColumn(tableName, 'product', {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: null,
  });
  await queryInterface.addColumn(tableName, 'is_active', {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  });
  await queryInterface.addColumn(tableName, 'descriptions', {
    type: Sequelize.JSON,
    default: [],
  });
  await queryInterface.addIndex(tableName, ['is_active', 'product']);
};

const down = async (queryInterface) => {
  await queryInterface.removeColumn(tableName, 'prices');
  await queryInterface.removeColumn(tableName, 'product');
  await queryInterface.removeColumn(tableName, 'is_active');
  await queryInterface.removeIndex(tableName, ['is_active', 'product']);
};

module.exports = {
  up,
  down,
};
