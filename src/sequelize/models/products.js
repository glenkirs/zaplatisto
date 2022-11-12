const tableName = 'products';

/**
 * Возвращает модель продукта
 * @param {Sequelize} sequelize
 * @param {Object} DataTypes
 * @returns {Model|*|{}|void}
 */
const model = (sequelize, DataTypes) => {
  /**
   * Модель продукта
   * @type {Object}
   */
  const Products = sequelize.define(tableName, {
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
    logo32: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    logo24: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    service: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      default: 0,
      primaryKey: true
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

  Products.associate = (models) => {
    Products.Plans = Products.hasMany(models.plans, {
      as: 'plans',
      foreignKey: 'product',
      sourceKey: 'id',
    });
    Products.belongsTo(models.services, {
      as: 'services',
      foreignKey: 'service',
      targetKey: 'id',
    });
  };

  Products.findById = id => {
    const where = { id };
    const options = {
      where,
    };

    return Products.findOne(options);
  };

  Products.getAllFront = () => {
    return Products.findAll({ include: 'plans' });
  }

  Products.getOneFront = id => {
    const where = { id };
    const options = {
      where,
      include: 'plans',
    };
    return Products.findOne(options);
  }
  
  Products.findByService = serviceId => {
    const where = { service: serviceId };
    const options = {
      where,
      include: 'plans'
    };

    return Products.findAll(options);
  };

  return Products;
};

module.exports = model;
