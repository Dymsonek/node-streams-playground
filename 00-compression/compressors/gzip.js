const { createGzip } = require('zlib');
const { pipeline } = require('stream/promises');
const fs = require('fs');

async function gzipCompress(inputPath, outputPath) {
  const source = fs.createReadStream(inputPath);
  const destination = fs.createWriteStream(outputPath);
  const gzip = createGzip();

  await pipeline(source, gzip, destination);
}

module.exports = gzipCompress;
