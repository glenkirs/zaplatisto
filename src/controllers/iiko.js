const errors = require('ec-errors');
const logger = require('../helpers/logger').getLogger();
const account = require('../services/account');
const models = require('../sequelize/models');
const logic = require('../logic/iiko');
const { _ } = require('lodash');

const Organization = models.organizations;

const getOrganization = async (ctx) => {
  let token;
  try {
    token = await logic.getToken(ctx.request.query.login);
  } catch (e) {
    throw new errors.NotFoundError({message: 'Не удалось получить токен iiko'});
  }

  if(token){
    const organizations = await logic.getOrganizationList(token);
    ctx.body = await Promise.all(organizations.map(async (o) => {
      const search = await Organization.findOneByOrganizationId(o.id);
      let shop = false;
      if(!search){
        Organization.create({
          organizationId: o.id,
          title: o.name,
          marketId: ctx.params.id
        });
      }else{
        shop = search.shop == null ? false : search.shop;
      }
      return {
        organization: {
          name: o.name,
          id: o.id
        },
        shop: shop
      }
    }))
  }else{
    throw new errors.NotFoundError();
  }
};

const updateSettings = async (ctx) => {
  await logic.stopUpdate();
  logic.init();
  ctx.body = true;
}

const getToken = async (ctx) => {
  if(ctx.query.marketId){
    const params = await account.getMarket(ctx.query.marketId);
    if(_.has(params, 'settings.externalServices.iiko.login')){
      ctx.body = {'token': await logic.getToken(_.get(params, 'settings.externalServices.iiko.login'))};
    }else{
      throw new errors.ValidationError('`iiko.login` must be set');
    }
  }else{
    throw new errors.ValidationError('`marketId` must be set');
  }
}

module.exports = {
  getOrganization,
  updateSettings,
  getToken,
}
