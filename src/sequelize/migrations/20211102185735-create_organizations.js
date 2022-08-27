const tableName = 'organizations';

const up = (queryInterface, Sequelize) =>
  queryInterface.createTable(tableName, {
    id: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    organizationId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    marketId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    shopId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

const down = queryInterface => queryInterface.dropTable(tableName);

module.exports = {
  up,
  down,
};
