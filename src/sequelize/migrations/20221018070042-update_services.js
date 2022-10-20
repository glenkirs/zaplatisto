const tableName = 'services';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn(tableName, 'label');
  await queryInterface.addColumn(tableName, 'is_active', {
    type: Sequelize.INTEGER,
    default: 0,
    allowNull: false,
  });
  await queryInterface.addColumn(tableName, 'template', {
    type: Sequelize.INTEGER,
    default: 1,
    allowNull: false,
  });
  await queryInterface.addIndex(tableName, ['is_active', 'template']);
};

const down = async (queryInterface) => {
  await queryInterface.removeColumn(tableName, 'is_active');
  await queryInterface.removeColumn(tableName, 'template');
  await queryInterface.removeIndex(tableName, ['is_active', 'template'])
};

module.exports = {
  up,
  down,
};
