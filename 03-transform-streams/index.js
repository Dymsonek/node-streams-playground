const fs = require('fs');
const path = require('path');
const os = require('os');
const { Transform } = require('stream');
const { pipeline } = require('stream/promises');

function lineNumbers() {
  let carry = '';
  let n = 1;
  return new Transform({
    transform(chunk, enc, cb) {
      const data = carry + chunk.toString('utf8');
      const parts = data.split('\n');
      carry = parts.pop();
      const out = parts.map((l) => `${n++}: ${l}\n`).join('');
      cb(null, out);
    },
    flush(cb) {
      if (carry.length > 0) this.push(`${n++}: ${carry}`);
      cb();
    },
  });
}

async function main() {
  const argPath = process.argv[2];
  const inputPath = argPath ? path.resolve(argPath) : path.join(__dirname, 'sample.txt');
  if (!fs.existsSync(inputPath)) {
    console.error('Usage: node index.js <path_to_file>');
    process.exit(1);
  }
  const outPath = path.join(os.tmpdir(), path.basename(inputPath) + '.numbered.txt');
  await pipeline(
    fs.createReadStream(inputPath),
    lineNumbers(),
    fs.createWriteStream(outPath)
  );
  console.log(outPath);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

