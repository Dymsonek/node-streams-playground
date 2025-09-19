const fs = require('fs');
const path = require('path');
const os = require('os');
const { withTimer } = require('../common/timer');
const brotliCompress = require('./compressors/brotli');
const gzipCompress = require('./compressors/gzip');
const deflateCompress = require('./compressors/deflate');

async function main() {
  const args = process.argv.slice(2);
  const inputArg = args.find((a) => !a.startsWith('-'));
  if (!inputArg || !fs.existsSync(inputArg)) {
    console.error('Usage: node index.js <path_to_file> [--out-dir DIR] [--keep]');
    process.exit(1);
  }

  let outDir = require('os').tmpdir();
  let keep = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--out-dir') {
      const d = args[i + 1];
      if (!d) {
        console.error('Error: --out-dir requires a directory path');
        process.exit(1);
      }
      outDir = require('path').resolve(d);
      i++;
    } else if (a === '--keep') {
      keep = true;
    }
  }

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const inputPath = path.resolve(inputArg);
  const fileName = path.basename(inputPath);
  const fileSize = fs.statSync(inputPath).size;

  const results = [];

  // Brotli
  const brotliOut = path.join(outDir, `${fileName}.br`);
  const brotliTime = await withTimer(brotliCompress)(inputPath, brotliOut);
  const brotliSize = fs.statSync(brotliOut).size;
  results.push({
    Algorithm: 'Brotli',
    'Time (ms)': brotliTime.toFixed(2),
    'Output Size (bytes)': brotliSize,
    'Compression Ratio': (100 * brotliSize / fileSize).toFixed(2) + '%',
  });

  // Gzip
  const gzipOut = path.join(outDir, `${fileName}.gz`);
  const gzipTime = await withTimer(gzipCompress)(inputPath, gzipOut);
  const gzipSize = fs.statSync(gzipOut).size;
  results.push({
    Algorithm: 'Gzip',
    'Time (ms)': gzipTime.toFixed(2),
    'Output Size (bytes)': gzipSize,
    'Compression Ratio': (100 * gzipSize / fileSize).toFixed(2) + '%',
  });

  // Deflate
  const deflateOut = path.join(outDir, `${fileName}.deflate`);
  const deflateTime = await withTimer(deflateCompress)(inputPath, deflateOut);
  const deflateSize = fs.statSync(deflateOut).size;
  results.push({
    Algorithm: 'Deflate',
    'Time (ms)': deflateTime.toFixed(2),
    'Output Size (bytes)': deflateSize,
    'Compression Ratio': (100 * deflateSize / fileSize).toFixed(2) + '%',
  });

  console.table(results);

  if (!keep) {
    try { fs.unlinkSync(brotliOut); } catch {}
    try { fs.unlinkSync(gzipOut); } catch {}
    try { fs.unlinkSync(deflateOut); } catch {}
  }
}

main().catch((err) => {
  console.error('Error:', err);
});
