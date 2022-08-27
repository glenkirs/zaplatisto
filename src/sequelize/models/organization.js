const tableName = 'organizations';

/**
 * Возвращает модель организации
 * @param {Sequelize} sequelize
 * @param {Object} DataTypes
 * @returns {Model|*|{}|void}
 */
const model = (sequelize, DataTypes) => {
  /**
   * Модель организации
   * @type {Object}
   */
  const Organization = sequelize.define(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    organizationId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    marketId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName,
    paranoid: false,
    timestamps: true,
  });
  
  Organization.findOneByOrganizationId = organizationId => {
    const where = { organizationId };
    const options = {
      where,
    };

    return Organization.findOne(options);
  };

  Organization.findByMarketId = marketId => {
    const where = { marketId };
    const options = {
      where,
    };

    return Organization.findAll(options);
  };

  return Organization;
};

module.exports = model;
