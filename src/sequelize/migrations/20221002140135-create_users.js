const tableName = 'users';

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
    name: {
      type: Sequelize.STRING,
      default: '-',
    },
    email: {
      type: Sequelize.STRING,
      default: null,
      allowNull: true,
    },
    balance: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    role: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 0,
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

  await queryInterface.addIndex(tableName, ['id', 'email', 'phone']);
};

const down = async (queryInterface) => {
  await queryInterface.dropTable(tableName);
};

module.exports = {
  up,
  down,
};
