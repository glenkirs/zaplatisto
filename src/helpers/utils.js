const moment = require('moment');
const sharp = require('sharp');
const logger = require('../helpers/logger').getLogger();
const path = require('path');
const fs = require('fs');
const errors = require('./errors');
const { v4: uuidv4 } = require('uuid');

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

module.exports = {
    validatePhone,
    generateSmsCode,
    validateEmail,
    checkMinutes,
    uploadFile,
    deleteFile,
};