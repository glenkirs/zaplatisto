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
    name: {
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
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      default: 0,
      primaryKey: true
    },
    product: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      default: null,
      primaryKey: true
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
    Plan.belongsTo(models.products, {
      as: 'products',
      foreignKey: 'product',
      targetKey: 'id',
    });
    Plan.PlansOptions = Plan.hasMany(models.plans_options, {
      as: 'plans_options',
      foreignKey: 'plan',
      sourceKey: 'id',
    });
  };

  Plan.getAllFront = (ctx) => {
    let where = {};
    let where_include = {};
    if(_.has(ctx.query, 'service') && _.isNumber(+ctx.query.service)){
      where.service = +ctx.query.service;
    }
    if(_.has(ctx.query, 'product') && _.isNumber(+ctx.query.product)){
      where.product = +ctx.query.product;
    }
    if(_.has(ctx.query, 'is_active') && _.isNumber(+ctx.query.is_active)){
      where.is_active = +ctx.query.is_active;
    }
    if(_.has(ctx.query, 'plans_options.is_active') && _.isNumber(+ctx.query['plans_options.is_active'])){
      where_include.is_active = +ctx.query['plans_options.is_active'];
    }
    return Plan.findAll({ where, include: { association: 'plans_options', where: where_include } });
  }

  Plan.getOneFront = id => {
    const where = { id };
    const options = {
      where,
      include: 'plans_options'
    };
    return Plan.findOne(options);
  }

  Plan.findById = id => {
    const where = { id };
    const options = {
      where,
      include: 'plans_options'
    };

    return Plan.findOne(options);
  };

  return Plan;
};

module.exports = model;
