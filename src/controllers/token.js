const errors = require('../helpers/errors');
const token = require('../components/token');

const generateToken = async (ctx) => {
  ctx.body = await token.generateToken({data: 'start'});
};


module.exports = {
  generateToken,
}
