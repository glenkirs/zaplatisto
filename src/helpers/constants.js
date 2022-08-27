import { common, roles, order, bonus, sms } from 'ec-constants';
import catalogConstants from 'ec-catalog-constants';

/**
 * Сообщение об успехе
 */
const messageOk = common.messageOk;

/**
 * Коды статусов
 */
const statuses = common.statuses;

/**
 * Витрины
 */
const showcases = common.showcases;

/**
 *  Наименование витрин
 */
const showcasesTitle = common.showcasesTitle; 

/**
 * Соответствие роли робота агрегатора витрине оформления заказа
 */
const robotToShowcase = common.robotToShowcase;

/**
 * Витрины при заказе через агрегатор
 */
const aggregatorShowcases = common.aggregatorShowcases;

/**
 * Коды статусов архивности
 */
const archivedStatuses = common.archivedStatuses;

/**
 * Роли менеджеров
 */
const managerRoles = roles.managerRoles;

/**
 * Роли роботов
 */
const robotRoles = roles.robotRoles;

/**
 * Массив ролей агрегаторов
 */
const aggregatorRoles = roles.aggregatorRoles;

/**
 * Роли Клиентов
 */
const clientRoles = roles.clientRoles;

/**
 * Роли сервисов
 */
const serviceRoles = roles.serviceRoles;

/**
 * Регионы - Все
 */
const regions = {
  all: '00000000-0000-0000-0000-000000000000',
};

const bonusOperations = Object.freeze({
  RESERVE: 0, // резервирование
  RELEASE: 1, // снятие блокировки
  DEPOSIT: 2, // начисление
  WITHDRAW: 3, // списание
  CLEAR: 4, // очистка
});

const moneyOperations = Object.freeze({
  deposit: 2,   // начисление
  withdraw: 3,  // списание
});

// Тип платежа
const paymentTypes = {
  fullPrepaid: 1, // Полная предоплата (электронные деньги)
  partPrepaid: 2, // Предоплата была внесена заранее, например при заказе на 100 пицц
  POS: 3,         // Оплата картой (VISA, MasterCard, Maestro) курьеру через мобильный терминал
  cash: 4,        // Оплата наличными через курьера
  POSnCache: 5,   // Оплата частично картой через мобильный терминал, частично наличными
};

// Типы оплаты заказа для агрегаторов
const aggregatorPaymentTypes = {
  fullPrepaid: 1, // Полная предоплата на сайте агрегатора
  cash: 2,        // Наличными курьеру
  pos: 3,         // Картой курьеру через мобильный терминал
};

// Параметры для достижения возможности ivi подписки (todo в панель)
const iviSubscription = {
  amount: 1800,               // Целевая сумма
  days: 30,                   // Число дней, по которым будет считаться сумма выполненных заказов
  specialSku: ['00000010069','00000010068','00000010072','00000010070','00000010075','00000010074'],  // SKU позиции, при заказе которой автоматически подписка
  orderQuantity: 4            // Максимум за 4 заказа возможно набрать 1800р, учитывая 500р минимальный заказ, дальше не смотрим
};

const convertAggregatorPaymentTypes = {
  [aggregatorPaymentTypes.fullPrepaid]: paymentTypes.fullPrepaid,
  [aggregatorPaymentTypes.cash]: paymentTypes.cash,
  [aggregatorPaymentTypes.pos]: paymentTypes.POS,
};

/**
 * Категория "пиццы"
 */
const pizzaCategory = catalogConstants.categorySpecialTypes.pizza;
const pizzaSpecialType = catalogConstants.productSpecialTypes.pizza;

/**
 * Особенности пиццы
 */
const pizzaFeatures = catalogConstants.pizzaFeatures;

/**
 * Особенности товара
 */
const productFeatures = { none: 0, ...pizzaFeatures };

/**
 * Типы активности товаров
 */
const productActiveTypes = catalogConstants.productActiveTypes;

/**
 * Типы товаров
 */
const productSpecialTypes = catalogConstants.productSpecialTypes;

/**
 * Причины отмены заказа
 */
const orderCancelReasons = order.cancelReasons;
const cancelReasonTitles = order.cancelReasonsTitle;

/**
 * Причины отказа от оформления заказа через КЦ
 */
const rejectReasons = order.rejectReasons;
const rejectReasonsTitle = order.rejectReasonsTitle;

const orderQueueStatuses = order.orderQueue.statuses;

// noinspection JSUnresolvedVariable
/**
 * Тип ручной скидки
 */
const customDiscountTypes = order.customDiscountTypes;

const domainDefault = common.domainDefault;

const calcCountRollsModes = [
  { value: 1, label: 'По типу товара Роллы' },
  { value: 2, label: 'По полю Набор для суши' }
]

const orderSettingsDefault = {
  minPrice: {
    value: 450,
    enabled: true
  },
  equipment: { 
    wasabi: { id: 294, additionalId: 300 },
    enabled: false,
    sushiSet: {
      id: 289,
      additionalId: 289,
      calcModeCountRollsSite: calcCountRollsModes[1],
      calcModeCountRollsAggregator: calcCountRollsModes[0],
      miltiplicatorValueSite: 1,
      miltiplicatorValueAggregator: 1.5,
      forcedEquate: true,
    },
    chopsticks: { id: 301, additionalId: 301 } },
  gpsService: 'external',
  blackPhones: { enabled: false },
  acceptWithSMS: false,
  autoSuccessOrders: [],
  cancelUpdaidOrders: { enabled: true, timeout: 5 },
  minutesForGift: { enabled: false, timeout: 28 },
};

export default {
  bonus,
  messageOk,
  statuses,
  showcases,
  showcasesTitle,
  robotToShowcase,
  archivedStatuses,
  regions,
  managerRoles,
  robotRoles,
  clientRoles,
  serviceRoles,
  aggregatorRoles,
  bonusOperations,
  moneyOperations,
  paymentTypes,
  pizzaCategory,
  pizzaSpecialType,
  pizzaFeatures,
  rejectReasons,
  productFeatures,
  productActiveTypes,
  productSpecialTypes,
  orderCancelReasons,
  orderQueueStatuses,
  cancelReasonTitles,
  rejectReasonsTitle,
  aggregatorShowcases,
  customDiscountTypes,
  convertAggregatorPaymentTypes,
  smsTemplates: sms.smsTemplates,
  iviSubscription,
  domainDefault,
  calcCountRollsModes,
  orderSettingsDefault,
};
