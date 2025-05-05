const fs = require('fs');
const path = require('path');
const os = require('os');
const { withTimer } = require('./utils/timer');
const brotliCompress = require('./compressors/brotli');
const gzipCompress = require('./compressors/gzip');
const deflateCompress = require('./compressors/deflate');

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath || !fs.existsSync(inputPath)) {
    console.error('Usage: node index.js <path_to_file>');
    process.exit(1);
  }

  const fileName = path.basename(inputPath);
  const fileSize = fs.statSync(inputPath).size;

  const results = [];

  // Brotli
  const brotliOut = path.join(os.tmpdir(), `${fileName}.br`);
  const brotliTime = await withTimer(brotliCompress)(inputPath, brotliOut);
  const brotliSize = fs.statSync(brotliOut).size;
  results.push({
    Algorithm: 'Brotli',
    'Time (ms)': brotliTime.toFixed(2),
    'Output Size (bytes)': brotliSize,
    'Compression Ratio': (100 * brotliSize / fileSize).toFixed(2) + '%',
  });

  // Gzip
  const gzipOut = path.join(os.tmpdir(), `${fileName}.gz`);
  const gzipTime = await withTimer(gzipCompress)(inputPath, gzipOut);
  const gzipSize = fs.statSync(gzipOut).size;
  results.push({
    Algorithm: 'Gzip',
    'Time (ms)': gzipTime.toFixed(2),
    'Output Size (bytes)': gzipSize,
    'Compression Ratio': (100 * gzipSize / fileSize).toFixed(2) + '%',
  });

  // Deflate
  const deflateOut = path.join(os.tmpdir(), `${fileName}.deflate`);
  const deflateTime = await withTimer(deflateCompress)(inputPath, deflateOut);
  const deflateSize = fs.statSync(deflateOut).size;
  results.push({
    Algorithm: 'Deflate',
    'Time (ms)': deflateTime.toFixed(2),
    'Output Size (bytes)': deflateSize,
    'Compression Ratio': (100 * deflateSize / fileSize).toFixed(2) + '%',
  });

  console.table(results);
}

main().catch((err) => {
  console.error('Error:', err);
});
