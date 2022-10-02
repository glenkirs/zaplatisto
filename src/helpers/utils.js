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

module.exports = {
    validatePhone,
    generateSmsCode,
    validateEmail,
};