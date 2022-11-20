const tableName = 'plans_options';
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
  const PlanOption = sequelize.define(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    plan: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      default: null,
      primaryKey: true
    },
    currency: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0
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

  PlanOption.associate = (models) => {
    PlanOption.belongsTo(models.plans, {
      as: 'plans',
      foreignKey: 'plan',
      targetKey: 'id',
    });
  };

  PlanOption.getAllFront = (ctx) => {
    let where = {};
    if(_.has(ctx.query, 'plan') && _.isNumber(+ctx.query.plan)){
      where.plan = +ctx.query.plan;
    }
    if(_.has(ctx.query, 'is_active') && _.isNumber(+ctx.query.is_active)){
      where.is_active = +ctx.query.is_active;
    }
    return PlanOption.findAll({ where });
  }

  PlanOption.getOneFront = id => {
    const where = { id };
    const options = { where };
    return PlanOption.findOne(options);
  }

  PlanOption.findById = id => {
    const where = { id };
    const options = {
      where,
    };

    return PlanOption.findOne(options);
  };

  return PlanOption;
};

module.exports = model;
