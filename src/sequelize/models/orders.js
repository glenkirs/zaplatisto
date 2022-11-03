const tableName = 'orders';

/**
 * Возвращает модель заказа
 * @param {Sequelize} sequelize
 * @param {Object} DataTypes
 * @returns {Model|*|{}|void}
 */
const model = (sequelize, DataTypes) => {
  /**
   * Модель заказа
   * @type {Object}
   */
  const Orders = sequelize.define(tableName, {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    service: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    product: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 0,
    },
    plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    pdf_file: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    deleted: {
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

  Orders.associate = (models) => {
    Orders.belongsTo(models.services, {
      as: 'services',
      foreignKey: 'service',
      targetKey: 'id',
    });
    /*Orders.belongsTo(models.plan, {
      as: 'plan',
      foreignKey: 'plan',
      targetKey: 'id',
    });
    Orders.belongsTo(models.user, {
      as: 'user',
      foreignKey: 'user',
      targetKey: 'id',
    });
    Orders.belongsTo(models.product, {
      as: 'product',
      foreignKey: 'product',
      targetKey: 'id',
    });*/
  };

  Orders.findById = id => {
    const where = { id };
    const options = {
      where,
    };

    return Orders.findOne(options);
  };

  Orders.getAllFront = () => {
    return Orders.findAll();
  }

  Orders.getOneFront = id => {
    const where = { id };
    const options = { where };
    return Orders.findOne(options);
  }
  
  Orders.findByService = serviceId => {
    const where = { service: serviceId };
    const options = {
      where,
    };

    return Orders.findOne(options);
  };

  return Orders;
};

module.exports = model;
