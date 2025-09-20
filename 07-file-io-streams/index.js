const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { withTimer } = require('../common/timer');

async function main() {
  const args = process.argv.slice(2);
  const given = args.find((a) => !a.startsWith('-'));
  const cIndex = args.indexOf('--chunk');
  const hwm = cIndex !== -1 ? Math.max(1, Number(args[cIndex + 1] || 0)) : 64 * 1024;
  const inputPath = given ? path.resolve(given) : path.join(__dirname, '..', 'common', 'fixtures', 'lorem.txt');
  if (!fs.existsSync(inputPath)) {
    console.error('Usage: node index.js <path_to_file> [--chunk BYTES]');
    process.exit(1);
  }

  const hash = crypto.createHash('sha256');
  let bytes = 0;
  let chunks = 0;

  const ms = await withTimer(async () => {
    for await (const chunk of fs.createReadStream(inputPath, { highWaterMark: hwm })) {
      bytes += chunk.length;
      chunks++;
      hash.update(chunk);
    }
  })();

  const sha256 = hash.digest('hex');
  console.log(JSON.stringify({ file: inputPath, bytes, chunks, chunkSize: hwm, sha256, ms: Number(ms.toFixed(2)) }));
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

