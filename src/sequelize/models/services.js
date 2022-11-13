const tableName = 'services';
const { _ } = require('lodash');
const { getLogger } = require('log4js');

/**
 * Возвращает модель сервиса
 * @param {Sequelize} sequelize
 * @param {Object} DataTypes
 * @returns {Model|*|{}|void}
 */
const model = (sequelize, DataTypes) => {
  /**
   * Модель сервиса
   * @type {Object}
   */
  const Services = sequelize.define(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: '-',
    },
    img: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    template: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
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

  /**
   * Ассоциация связанных моделей
   * @param {Object} models
   * @param {Model} models.plans
   */
   Services.associate = (models) => {
    Services.Plans = Services.hasMany(models.plans, {
      as: 'plans',
      foreignKey: 'service',
      sourceKey: 'id',
    });
    Services.Products = Services.hasMany(models.products, {
      as: 'products',
      foreignKey: 'service',
      sourceKey: 'id',
    });
  };

  Services.findById = id => {
    const where = { id };
    const options = {
      where,
    };

    return Services.findOne(options);
  };
  
  Services.findByPhone = phone => {
    const where = { phone };
    const options = {
      where,
    };

    return Services.findOne(options);
  };

  Services.getAllFront = (ctx) => {
    let where = {};
    let where_products = {};
    let where_plans = {};
    let where_plans_options = {};
    if(_.has(ctx.query, 'template') && _.isNumber(+ctx.query.template)){
      where.template = +ctx.query.template;
    }
    if(_.has(ctx.query, 'is_active') && _.isNumber(+ctx.query.is_active)){
      where.is_active = +ctx.query.is_active;
    }
    if(_.has(ctx.query, 'plans.is_active') && _.isNumber(+ctx.query['plans.is_active'])){
      where_plans.is_active = +ctx.query['plans.is_active'];
    }
    if(_.has(ctx.query, 'plans.plans_options.is_active') && _.isNumber(+ctx.query['plans.plans_options.is_active'])){
      where_plans_options.is_active = +ctx.query['plans.plans_options.is_active'];
    }
    if(_.has(ctx.query, 'products.is_active') && _.isNumber(+ctx.query['products.is_active'])){
      where_products.is_active = +ctx.query['products.is_active'];
    }

    return Services.findAll({ 
      where,
      include: [{
        association: 'plans',
        where: where_plans,
        required: false,
        include: {
          association: 'plans_options',
          where: where_plans_options,
          required: false
        }
      }, {
        association: 'products',
        where: where_products,
        required: false,
        include: {
          association: 'plans',
          where: where_plans,
          required: false,
          include: {
            association: 'plans_options',
            where: where_plans_options,
            required: false
          }
        }
      }]
    });
  }

  Services.getOneFront = id => {
    const where = { id };
    const options = {
      where,
      include: [{
        model: sequelize.models.plans,
        as: 'plans'
      },
      {
        model: sequelize.models.products,
        as: 'products',
        include: [{
          model: sequelize.models.plans,
          as: 'plans'
        }]
      }]
    };
    return Services.findOne(options);
  }

  return Services;
};

module.exports = model;
