const { parentPort } = require('worker_threads');
const crypto = require('crypto');

parentPort.on('message', ({ id, chunk }) => {
  const hash = crypto.createHash('sha256');
  hash.update(chunk);
  const hex = hash.digest('hex');
  parentPort.postMessage({ id, hex });
});

