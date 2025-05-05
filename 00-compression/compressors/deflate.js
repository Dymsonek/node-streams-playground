const { createDeflate } = require('zlib');
const { pipeline } = require('stream/promises');
const fs = require('fs');

async function deflateCompress(inputPath, outputPath) {
  const source = fs.createReadStream(inputPath);
  const destination = fs.createWriteStream(outputPath);
  const deflate = createDeflate();

  await pipeline(source, deflate, destination);
}

module.exports = deflateCompress;
