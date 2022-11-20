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
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      default: 0,
    },
    product: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      default: 0,
    },
    plan: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      default: 0,
    },
    price: {
      type: DataTypes.JSON,
      defaultValue: {},
      allowNull: true,
      get: function () {
        return JSON.parse(this.getDataValue('price'));
      },
    },
    options: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: true,
      get: function () {
        return JSON.parse(this.getDataValue('options'));
      },
    },
    members: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 0,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      default: 0,
    },
    user: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      default: 0,
    },
    user_account: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      default: 0,
    },
    pay_url: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    status: {
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
    Orders.hasOne(models.services, {
      as: 'service_info',
      foreignKey: 'id',
      sourceKey: 'service',
    });
    Orders.hasOne(models.products, {
      as: 'product_info',
      foreignKey: 'id',
      sourceKey: 'product',
    });
    Orders.hasOne(models.plans, {
      as: 'plan_info',
      foreignKey: 'id',
      sourceKey: 'plan',
    });
    Orders.hasOne(models.users, {
      as: 'user_info',
      foreignKey: 'id',
      sourceKey: 'user',
    });
    Orders.hasOne(models.user_accounts, {
      as: 'user_account_info',
      foreignKey: 'id',
      sourceKey: 'user_account',
    });
  };

  Orders.findById = id => {
    const where = { id };
    const options = {
      where,
    };

    return Orders.findOne(options);
  };

  Orders.getAllFront = () => {
    return Orders.findAll({
      include: [{
        association: 'service_info'
      },{
        association: 'product_info'
      },{
        association: 'plan_info'
      },{
        association: 'user_info'
      },{
        association: 'user_account_info'
      }]
    });
  }

  Orders.getOneFront = id => {
    const where = { id };
    const options = {
      where,
      include: [{
        association: 'service_info'
      },{
        association: 'product_info'
      },{
        association: 'plan_info'
      },{
        association: 'user_info'
      },{
        association: 'user_account_info'
      }]
    };
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
