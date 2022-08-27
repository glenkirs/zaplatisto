const { _ } = require('lodash');
const account = require('../services/account');
const request = require('request-promise-native');
const config = require('../config');
const oneC = require('./1c');
const models = require('../sequelize/models');
const logger = require('../helpers/logger').getLogger();
const errors = require('ec-errors');
const Organization = models.organizations;
const Stops = models.stops;

const OPTIONS = {
    organization: 10*60*1000, //Обновление организаций
    stop: 3*60*1000,         //Обновление стопов позиций
};

const timers = [];

const init = async () => {
    const markets = await account.getMarkets();
    if(markets){
        markets.forEach(async (el) => {
            if(_.has(el.settings.externalServices, 'iiko') && (_.has(el.settings.externalServices.iiko, 'login') && !validatePhone(el.settings.externalServices.iiko.login) && el.settings.externalServices.iiko.login.trim().length != 0)){
                if(_.has(el.settings.externalServices.iiko, 'timeinterval') && _.has(el.settings.externalServices.iiko.timeinterval, 'stop')){
                    OPTIONS.stop = +el.settings.externalServices.iiko.timeinterval.stop * 60 * 1000;
                }
                if(_.has(el.settings.externalServices.iiko, 'timeinterval') && _.has(el.settings.externalServices.iiko.timeinterval, 'organization')){
                    OPTIONS.organization = +el.settings.externalServices.iiko.timeinterval.organization * 60 * 1000;
                }
                timers.push(setInterval(updateOrganizations, OPTIONS.organization, { ...el.settings.externalServices.iiko, id: el.id }));
                timers.push(setInterval(updateStops, OPTIONS.stop, { ...el.settings.externalServices.iiko, id: el.id }));
            }
        });
    }
};

const updateOrganizations = async params => {
    const token = await getToken(params.login);
    if(token){
        const organizations = await getOrganizationList(token);
        organizations.forEach(async o => {
            const search = await Organization.findOneByOrganizationId(o.id);
            if(!search){
                Organization.create({
                    organizationId: o.id,
                    title: o.name,
                    marketId: params.id
                });
            }
        })
    }
}

const updateStops = async params => {
    const token = await getToken(params.login);
    if(token){
        const organizations = await getOrganizationList(token);
        organizations.forEach(async o => {
            const stops = await getStopList(token, o.id);
            const organization = await Organization.findOneByOrganizationId(o.id);
            const nomenclature = await getNomenclature(token, o.id);
            const allProduct = await Stops.findAllByOrganization(o.id);
            const products = [];
            if(stops.length > 0){
                stops.forEach(async s => {
                    if(s.organizationId == o.id && s.items.length > 0 && 'items' in s.items[0] && organization){
                        s.items[0].items.forEach(async i => {
                            const product = findProductInNomenclature(i.productId, nomenclature);
                            if(i.balance === 0 && !product.isDeleted && _.has(product, 'name')){
                                products.push({ productId: i.productId, organizationId: o.id, shopId: organization.shopId, sku: product.code });
                                const search = await Stops.findOneByProductIdAndOrganization(i.productId, o.id);
                                if(!search){
                                    await Stops.create({
                                        title: product.name,
                                        productId: i.productId,
                                        organizationId: o.id,
                                        sku: product.code,
                                    });
                                    await addProductStopEcomm(product.code, organization.shopId, organization.marketId);
                                }
                            }
                        })
                    }
                });
            }
            if(allProduct.length > products.length){
                const results = allProduct.filter(({ productId: id1 }) => !products.some(({ productId: id2 }) => id2 === id1));
                results.forEach(async r => {
                    await removeProductStopEcomm(r.sku, organization.shopId, organization.marketId);
                    await Stops.destroy({
                        where: {
                            productId: r.productId,
                            organizationId: r.organizationId
                        }
                    })
                });
            }
        });
    }
}

const getToken = async (login) => {
    try {
        const data = await request({
            uri: `${config.iikoApiUrl}access_token`,
            method: 'POST',
            body: JSON.stringify({apiLogin: login}),
            json: true,
        });
        return data.errorDescription ? false : data.token;
    } catch (err) {
        logger.error({ message: 'logic.iiko.getToken', err });

        return [];
    }
};

const getOrganizationList = async token => {
    try {
        const data = await request({
            uri: `${config.iikoApiUrl}organizations`,
            method: 'POST',
            body: JSON.stringify({}),
            headers: {'Authorization': `Bearer ${token}`, 'Content-type': 'application/json'},
            json: true,
        });
        return data.errorDescription ? false : data.organizations;
    } catch (err) {
        logger.error({ message: 'logic.iiko.getOrganizationList', err });

        return [];
    }
};

const getNomenclature = async (token, organization) => {
    try {
        const data = await request({
            uri: `${config.iikoApiUrl}nomenclature`,
            method: 'POST',
            body: JSON.stringify({organizationId: organization}),
            headers: {'Authorization': `Bearer ${token}`, 'Content-type': 'application/json'},
            json: true,
        });
        return data.errorDescription ? false : data.products;
    } catch (err) {
        logger.error({ message: 'logic.iiko.getNomenclature', err });

        return [];
    }
};

const getStopList = async (token, organization) => {
    try {
        const data = await request({
            uri: `${config.iikoApiUrl}stop_lists`,
            method: 'POST',
            body: JSON.stringify({organizationIds: [organization]}),
            headers: {'Authorization': `Bearer ${token}`, 'Content-type': 'application/json'},
            json: true,
        });
        return data.errorDescription ? false : data.terminalGroupStopLists;
    } catch (err) {
        logger.error({ message: 'logic.iiko.getStopList', err });

        return [];
    }
};

const findProductInNomenclature = (productId, nomenclature) => {
    const find = nomenclature.filter(i => i.id == productId);
    return find.length > 0 ? find[0] : false;
}

const stopUpdate = async () => {
    timers.forEach(t => {
        clearInterval(t)
    })
    const markets = await account.getMarkets();
    markets.forEach(async m => {
        if(m.settings.externalServices.iiko && m.settings.externalServices.iiko.shops != undefined){
            const organizations = await Organization.findByMarketId(m.id);
            if(organizations){
                organizations.forEach(async o => {
                    if(o){
                        Organization.update(
                            { shopId: m.settings.externalServices.iiko.shops.filter(s => s.organization.id == o.organizationId)[0].shop },
                            { where: { id: o.id } }
                        )
                    }
                })
            }
        }
    })
}

const addProductStopEcomm = async (sku, shopId, marketId) => {
    if(shopId == undefined) throw new errors.NotFoundError({message: 'Не найден параметр `shopId`'});
    const params = await account.getMarket(marketId);
    const shop = await account.getShop(shopId);
    if(_.has(params, 'settings.externalServices.account1c') && shop){
        await oneC.skuStop(sku, shop, _.get(params, 'settings.externalServices.account1c'));
    }
}

const removeProductStopEcomm = async (sku, shopId, marketId) => {
    if(shopId == undefined) throw new errors.NotFoundError({message: 'Не найден параметр `shopId`'});
    const params = await account.getMarket(marketId);
    const shop = await account.getShop(shopId);
    if(_.has(params, 'settings.externalServices.account1c') && shop){
        await oneC.skuStart(sku, shop, _.get(params, 'settings.externalServices.account1c'));
    }
}

const validatePhone = phone => {
    let regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return regex.test(phone);
}

module.exports = { 
    init,
    getToken,
    getOrganizationList,
    stopUpdate,
};
