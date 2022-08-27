const tableName = 'stops';

const up = (queryInterface, Sequelize) =>
  queryInterface.createTable(tableName, {
    id: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    productId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    organizationId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sku: {
      type: Sequelize.STRING(11),
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
