const tableName = 'products';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER.UNSIGNED,
    },
    title: {
      type: Sequelize.STRING,
      default: null,
      allowNull: true,
    },
    logo32: {
      type: Sequelize.STRING,
      default: null,
      allowNull: true,
    },
    logo24: {
      type: Sequelize.STRING,
      default: null,
      allowNull: true,
    },
    service: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 0,
    },
    is_active: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  });

  await queryInterface.addIndex(tableName, ['id', 'service', 'title']);
};

const down = async (queryInterface) => {
  await queryInterface.dropTable(tableName);
};

module.exports = {
  up,
  down,
};
