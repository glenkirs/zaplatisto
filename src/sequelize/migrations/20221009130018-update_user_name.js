const tableName = 'users';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn(tableName, 'name', { type: Sequelize.STRING, allowNull: true, defaultValue: null });
};

const down = async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn(tableName, 'name', { type: Sequelize.STRING, allowNull: false });
};

module.exports = {
  up,
  down,
};
