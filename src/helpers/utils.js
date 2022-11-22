const moment = require('moment');
const sharp = require('sharp');
const logger = require('../helpers/logger').getLogger();
const path = require('path');
const fs = require('fs');
const errors = require('./errors');
const { v4: uuidv4 } = require('uuid');
const request = require('request-promise-native');
const constants = require('./constants');
const CryptoJS = require('crypto-js');
const config = require('../config');
const exec = require('child-process-promise').exec;

/**
* Валидация телефона
* @param {String} phone
* @return {Boolean}
*/
const validatePhone = phone => {
    let regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return regex.test(phone);
}

/**
* Валидация E-mail
* @return {Boolean}
*/
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

/**
* Генерация 4х значного числа для SMS
* @return {String}
*/
const generateSmsCode = () => {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}

const generatePassword = (length, options) => {
    const optionsChars = {
        digits: "1234567890",
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        symbols: "@$!%&"
    }
    const chars = [];
    for (let key in options) {
        if (options.hasOwnProperty(key) && options[key] && optionsChars.hasOwnProperty(key)) {
            chars.push(optionsChars[key]);
        }
    }

    if (!chars.length)
        return '';

    let password = "";

    for (let j = 0; j < chars.length; j++) {
        password += chars[j].charAt(Math.floor(Math.random() * chars[j].length));
    }
    if (length > chars.length) {
        length = length - chars.length;
        for (let i = 0; i < length; i++) {
            const index = Math.floor(Math.random() * chars.length);
            password += chars[index].charAt(Math.floor(Math.random() * chars[index].length));
        }
    }

    return password;
}

/**
* Кол-во минут от времени значения
* @return {Float}
*/
const checkMinutes = (date) => {
    const now = new Date;
    const dur = moment.duration({ from: now, to: moment(date) });
    
    return (dur.asMinutes() * -1).toFixed(2);
}

/**
* Сохранение загруженного файла
* @return {String} Путь до загруженного файла
*/
const uploadFile = async (file, size = { width: 80, height: 18 }) => {
    sharp.cache(false);
    return new Promise(async (resolve, reject) => {
        if(file){
            const image = sharp(file.path);
            const metadata = await image.metadata();
            const name = `${uuidv4()}_${size.width}x${size.height}.${metadata.format}`;
            const newpath = `${path.resolve(__dirname, '../../static')}/${name}`;
            
            await image.resize({ fit:  "cover", canvas: 'min', height: size.height, width: size.width })
            .toFile(newpath);

            resolve(`/static/${name}`);
        }else{
            reject();
        }
    });
}

/**
* Сохранение загруженного файла
* @return {String} Путь до загруженного файла
*/
const deleteFile = async (path) => {
    return new Promise(function(resolve, reject) {
        if (fs.existsSync(path)) {
            fs.unlink(path, (err) => {
                if (err) {
                    throw new errors.ForbiddenError(err);
                }
                resolve();
            })
        }else{
            resolve();
        }
    });
}

/**
* Получение валют
* @return {Array} Массив доступных и актуальной цены валют
*/
const currencyList = async () => {
    const options = {
        method: 'GET',
        uri: 'https://www.cbr-xml-daily.ru/daily_json.js',
        json: true
    }
    const list = await request(options);

    return Object.values(constants.currency).map((item, i) => {
        let name, price;
        switch(i){
            case 0:
                name = 'RUB';
                price = 1 + ((1*constants.percent_project)/100);
                break;
            case 1:
                name = 'USD';
                price = list.Valute.USD.Value + ((list.Valute.USD.Value*constants.percent_project)/100);
                break;
        }
        return {
            id: i,
            name: name,
            price: price
        }
    });
}

/**
* Получение валют
* @return {Float} Цена валюты на проекте
*/
const currencyById = async (currency) => {
    const options = {
        method: 'GET',
        uri: 'https://www.cbr-xml-daily.ru/daily_json.js',
        json: true
    }
    const list = await request(options);

    switch(currency){
        case 0:
            return 1 + ((1*constants.percent_project)/100);
        case 1:
            return list.Valute.USD.Value + ((list.Valute.USD.Value*constants.percent_project)/100);
    }
}

/**
* Генерация Email аккаунта
* @return {Json} Данные аккаунта
*/
const generateEmailAccount = async (user) => {
    const name = `account_${user.id}`;
    const password = generatePassword(9, {digits: true, lowercase: true, uppercase: true, symbols: true});

    return {
        login: `${name}@zaplatisto.ru`,
        password: CryptoJS.AES.encrypt(password, config.passSecret).toString()
    }
}

/**
* Создание Email аккаунта
* @return {Json} Данные аккаунта
*/
const createEmailAccount = async (user) => {
    const bytes = CryptoJS.AES.decrypt(user.password, config.passSecret);
    const pass = bytes.toString(CryptoJS.enc.Utf8);
    return exec(`useradd -p $(openssl passwd -crypt ${pass}) ${user.login}`);
}

module.exports = {
    validatePhone,
    generateSmsCode,
    validateEmail,
    checkMinutes,
    uploadFile,
    deleteFile,
    currencyList,
    currencyById,
    generateEmailAccount,
    createEmailAccount
};