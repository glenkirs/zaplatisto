const tableName = 'stops';

/**
 * Возвращает модель стопа
 * @param {Sequelize} sequelize
 * @param {Object} DataTypes
 * @returns {Model|*|{}|void}
 */
const model = (sequelize, DataTypes) => {
  /**
   * Модель ресторана
   * @type {Object}
   */
  const Stops = sequelize.define(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(11),
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
  
  Stops.findOneByProductIdAndOrganization = (productId, organizationId) => {
    const where = { productId, organizationId };
    const options = {
      where,
    };

    return Stops.findOne(options);
  };

  Stops.findAllByOrganization = organizationId => {
    const where = { organizationId };
    const options = {
      where,
    };

    return Stops.findAll(options);
  };

  return Stops;
};

module.exports = model;
