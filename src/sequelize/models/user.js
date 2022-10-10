const tableName = 'users';
const { makePaginate } = require('sequelize-cursor-pagination');

/**
 * Возвращает модель пользователя
 * @param {Sequelize} sequelize
 * @param {Object} DataTypes
 * @returns {Model|*|{}|void}
 */
const model = (sequelize, DataTypes) => {
  /**
   * Модель пользователя
   * @type {Object}
   */
  const User = sequelize.define(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    phone: {
      type: DataTypes.STRING(11, 20),
      allowNull: false,
      defaultValue: '12345678912',
      validate: {
        isNumeric: {
          msg: 'phone must contain only numeric symbols',
        },
        len: {
          args: [11, 20],
          msg: 'phone length must be in range [11, 20]',
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
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

  User.findById = id => {
    const where = { id };
    const options = {
      where,
    };

    return User.findOne(options);
  };
  
  User.findByPhone = phone => {
    const where = { phone };
    const options = {
      where,
    };

    return User.findOne(options);
  };

  User.paginate = makePaginate(User);

  return User;
};

module.exports = model;
