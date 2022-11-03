const tableName = 'plans';
const { _ } = require('lodash');

/**
 * Возвращает модель тарифа
 * @param {Sequelize} sequelize
 * @param {Object} DataTypes
 * @returns {Model|*|{}|void}
 */
const model = (sequelize, DataTypes) => {
  /**
   * Модель тарифа
   * @type {Object}
   */
  const Plan = sequelize.define(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    descriptions: {
      type: DataTypes.JSON,
      defaultValue: [],
      get: function () {
        return JSON.parse(this.getDataValue('descriptions'));
      },
    },
    prices: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
      get: function () {
        return JSON.parse(this.getDataValue('prices'));
      },
    },
    service: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    product: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: null,
    },
    is_members: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.INTEGER,
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

  Plan.associate = (models) => {
    Plan.belongsTo(models.services, {
      as: 'services',
      foreignKey: 'service',
      targetKey: 'id',
    });
  };

  Plan.getAllFront = () => {
    return Plan.findAll();
  }

  Plan.getOneFront = id => {
    const where = { id };
    const options = { where };
    return Plan.findOne(options);
  }

  Plan.findById = id => {
    const where = { id };
    const options = {
      where,
    };

    return Plan.findOne(options);
  };

  return Plan;
};

module.exports = model;
