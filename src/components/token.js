const { _ } = require('lodash');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

const generateToken = async (payload, params = {}) => {
    const jwtid = uuidv4();
    const expiresIn = config.expiresIn;
    const token = jwt.sign(payload, config.jwtSecret, { jwtid, expiresIn, ...params });
    const decodedToken = jwt.decode(token);
  
    return { token, decodedToken };
};

module.exports = { 
    generateToken,
};
