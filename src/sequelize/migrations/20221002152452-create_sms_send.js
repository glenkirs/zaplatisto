const tableName = 'sms_send';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER.UNSIGNED,
    },
    phone: {
      type: Sequelize.STRING(20),
      allowNull: false,
      default: '12345678912',
    },
    code: {
      type: Sequelize.STRING,
      default: '0000',
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    }
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  });

  await queryInterface.addIndex(tableName, ['id', 'phone']);
};

const down = async (queryInterface) => {
  await queryInterface.dropTable(tableName);
};

module.exports = {
  up,
  down,
};
