const tableName = 'plans';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER.UNSIGNED,
    },
    title: {
      type: Sequelize.STRING,
      default: '-',
    },
    sub_title: {
      type: Sequelize.STRING,
      default: null,
      allowNull: true,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 0,
    },
    service: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 0
    },
    billing: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 0,
    },
    descriptions: {
      type: Sequelize.JSON,
      default: [],
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

  await queryInterface.addIndex(tableName, ['id', 'service', 'billing']);
};

const down = async (queryInterface) => {
  await queryInterface.dropTable(tableName);
};

module.exports = {
  up,
  down,
};
