const path = require('path');
const { createDoc } = require('apidoc');
const logger = require('../helpers/logger').getLogger();

logger.info(`${path.resolve(__dirname, '../../src')} : ${path.resolve(__dirname, '../../doc')}`);

const doc = createDoc({
  src: path.resolve(__dirname, '../../src'),
  dest: path.resolve(__dirname, '../../doc'),
  silent: true,
})
if (typeof doc !== 'boolean') {
  logger.info(`Documentation generate success!`);
}