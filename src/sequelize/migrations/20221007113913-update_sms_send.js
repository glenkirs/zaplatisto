const tableName = 'sms_send';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn(tableName, 'verify', Sequelize.INTEGER);
};

const down = async (queryInterface) => {
  await queryInterface.removeColumn(tableName, 'verify');
};

module.exports = {
  up,
  down,
};
