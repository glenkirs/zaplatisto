const tableName = 'sms_send';

/**
 * Возвращает модель отправленного СМС
 * @param {Sequelize} sequelize
 * @param {Object} DataTypes
 * @returns {Model|*|{}|void}
 */
const model = (sequelize, DataTypes) => {
  /**
   * Модель отправленного смс
   * @type {Object}
   */
  const SmsSend = sequelize.define(tableName, {
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
    code: {
      type: DataTypes.STRING,
      defaultValue: '0000',
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    }
  },
  {
    tableName,
    paranoid: false,
    timestamps: true,
  });
  
  SmsSend.findOneByPhone = phone => {
    const where = { phone };
    const options = {
      where,
    };

    return SmsSend.findOne(options);
  };

  return SmsSend;
};

module.exports = model;
