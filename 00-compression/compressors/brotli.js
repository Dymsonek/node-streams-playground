const { createBrotliCompress } = require('zlib');
const { pipeline } = require('stream/promises');
const fs = require('fs');

async function brotliCompress(inputPath, outputPath) {
  const source = fs.createReadStream(inputPath);
  const destination = fs.createWriteStream(outputPath);
  const brotli = createBrotliCompress();

  await pipeline(source, brotli, destination);
}

module.exports = brotliCompress;
