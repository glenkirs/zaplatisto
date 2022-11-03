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

module.exports = {
    roles,
    actions,
    currency,
    billing,
    template
}