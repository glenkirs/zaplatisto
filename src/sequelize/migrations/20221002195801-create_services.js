const tableName = 'services';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER.UNSIGNED,
    },
    name: {
      type: Sequelize.STRING,
      default: '-',
    },
    img: {
      type: Sequelize.STRING,
      default: null,
      allowNull: true,
    },
    label: {
      type: Sequelize.STRING,
      allowNull: true,
      default: null,
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

  await queryInterface.addIndex(tableName, ['id']);
};

const down = async (queryInterface) => {
  await queryInterface.dropTable(tableName);
};

module.exports = {
  up,
  down,
};
