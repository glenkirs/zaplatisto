const tableName = 'plans';

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
      defaultValue: '-',
    },
    sub_title: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    service: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    billing: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    descriptions: {
      type: DataTypes.JSON,
      defaultValue: [],
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

  Plan.findById = id => {
    const where = { id };
    const options = {
      where,
    };

    return Plan.findOne(options);
  };
  
  Plan.findByPhone = phone => {
    const where = { phone };
    const options = {
      where,
    };

    return Plan.findOne(options);
  };

  return Plan;
};

module.exports = model;
