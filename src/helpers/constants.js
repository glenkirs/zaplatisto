const roles = {
    guest: 0,
    user: 1,
    admin: 2
};

const actions = {
    allow: 'allow',
    deny: 'deny',
};

const template = {
    0: 'Один продукт',
    1: 'Несколько продуктов',
    2: 'Пополнение по логину',
};

const currency = {
    0: '₽',
    1: '$',
};

const billing = {
    0: 'Ежемесячный',
    1: 'Год',
};

const order_status = {
    0: 'Новый',
    1: 'Оплачен',
    2: 'Отменён',
};

const percent_project = process.env.PERCENT_PROJECT ?? 20;

module.exports = {
    roles,
    actions,
    currency,
    billing,
    template,
    percent_project,
    order_status
}