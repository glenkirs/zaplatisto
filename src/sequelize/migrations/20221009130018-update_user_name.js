const tableName = 'users';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn(tableName, 'name', { allowNull: true, defaultValue: null });
};

const down = async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn(tableName, 'name', { allowNull: false });
};

export {
  up,
  down,
};
