const up = async (queryInterface, Sequelize) => {
  await queryInterface.renameColumn('plans', 'title', 'name');
  await queryInterface.renameColumn('products', 'title', 'name');
};

const down = async (queryInterface) => {
  await queryInterface.renameColumn('plans', 'name', 'title');
  await queryInterface.renameColumn('products', 'name', 'title');
};

module.exports = {
  up,
  down,
};
