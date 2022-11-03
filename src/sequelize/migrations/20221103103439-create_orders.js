const tableName = 'orders';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER.UNSIGNED,
    },
    service: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 0
    },
    product: {
      type: Sequelize.INTEGER,
      allowNull: true,
      default: 0
    },
    plan: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 0
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 0
    },
    user: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 0
    },
    pdf_file: {
      type: Sequelize.STRING,
      default: null,
      allowNull: true,
    },
    deleted: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 0
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

  await queryInterface.addIndex(tableName, ['id', 'service', 'product', 'plan', 'status', 'user', 'deleted']);
};

const down = async (queryInterface) => {
  await queryInterface.dropTable(tableName);
};

module.exports = {
  up,
  down,
};
