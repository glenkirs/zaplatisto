const tableName = 'services';

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
    label: {
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

  Services.getAllFront = () => {
    return Services.findAll({ include: 'plans' });
  }

  Services.getOneFront = id => {
    const where = { id };
    const options = {
      where,
      include: 'plans'
    };
    return Services.findOne(options);
  }

  return Services;
};

module.exports = model;
