const tableName = 'orders';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn(tableName, 'total', {
    type: Sequelize.FLOAT,
    default: 0,
    allowNull: true,
    after: 'members'
  });
  await queryInterface.addColumn(tableName, 'pay_url', {
    type: Sequelize.STRING,
    default: null,
    allowNull: true,
    after: 'user_account'
  });
};

const down = async (queryInterface) => {
  await queryInterface.removeColumn(tableName, 'total');
  await queryInterface.removeColumn(tableName, 'pay_url');
};

module.exports = {
  up,
  down,
};
