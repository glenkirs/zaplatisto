const tableName = 'user_accounts';
const { _ } = require('lodash');
const { makePaginate } = require('sequelize-cursor-pagination');

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
  const UserAccount = sequelize.define(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    login: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    service: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      default: null,
      primaryKey: true
    },
    user: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      default: null,
      primaryKey: true
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

  UserAccount.associate = (models) => {
    UserAccount.belongsTo(models.services, {
      as: 'services',
      foreignKey: 'service',
      targetKey: 'id',
    });
    UserAccount.belongsTo(models.users, {
      as: 'users',
      foreignKey: 'user',
      targetKey: 'id',
    });
  };

  UserAccount.getAllFront = (ctx) => {
    let where = {};
    if(_.has(ctx.query, 'service') && _.isNumber(+ctx.query.service)){
      where.service = +ctx.query.service;
    }
    if(_.has(ctx.query, 'user') && _.isNumber(+ctx.query.user)){
      where.user = +ctx.query.user;
    }
    return UserAccount.findAll({ where });
  }

  UserAccount.getOneFront = id => {
    const where = { id };
    const options = { where };
    return UserAccount.findOne(options);
  }

  UserAccount.getOneFrontByUser = id => {
    const where = { user: id };
    const options = { where };
    return UserAccount.findAll(options);
  }

  UserAccount.findByUserAndService = (userId, serviceId) => {
    const where = {
      user: userId,
      service: serviceId
    };
    const options = { where };

    return UserAccount.findOne(options);
  };

  UserAccount.paginate = makePaginate(UserAccount);

  return UserAccount;
};

module.exports = model;
