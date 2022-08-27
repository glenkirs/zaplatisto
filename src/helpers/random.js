const crypto = require('crypto');

const requestId = (length = 16) => new Promise((resolve, reject) => {
  try {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) {
        reject(err);
      }
      resolve(buffer.toString('hex'));
    });
  } catch (err) {
    reject(err);
  }
});

module.exports = {
  requestId,
};
