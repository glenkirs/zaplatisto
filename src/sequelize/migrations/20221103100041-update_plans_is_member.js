const tableName = 'plans';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn(tableName, 'is_members', {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0,
  });
  await queryInterface.addIndex(tableName, ['is_members']);
};

const down = async (queryInterface) => {
  await queryInterface.removeColumn(tableName, 'is_members');
  await queryInterface.removeIndex(tableName, ['is_members']);
};

module.exports = {
  up,
  down,
};
