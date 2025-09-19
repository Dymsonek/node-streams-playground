const fs = require('fs');
const path = require('path');
const os = require('os');
const { Transform } = require('stream');
const { pipeline } = require('stream/promises');

function lowercase() {
  return new Transform({
    transform(chunk, enc, cb) {
      cb(null, Buffer.from(chunk.toString('utf8').toLowerCase()));
    },
  });
}

function collapseWhitespace() {
  let carry = '';
  return new Transform({
    transform(chunk, enc, cb) {
      const data = carry + chunk.toString('utf8');
      const parts = data.split(/\s+/);
      carry = parts.pop() ?? '';
      const joined = parts.filter(Boolean).join(' ');
      cb(null, joined);
    },
    flush(cb) {
      if (carry) this.push(carry);
      cb();
    },
  });
}

function failAfterBytes(limit) {
  let seen = 0;
  return new Transform({
    transform(chunk, enc, cb) {
      seen += chunk.length;
      if (limit > 0 && seen > limit) return cb(new Error('Intentional failure after byte limit'));
      cb(null, chunk);
    },
  });
}

async function main() {
  const args = process.argv.slice(2);
  const fail = args.includes('--fail');
  const given = args.find((a) => !a.startsWith('-'));
  const defaultPath = path.join(__dirname, '..', 'common', 'fixtures', 'lorem.txt');
  const inputPath = given ? path.resolve(given) : defaultPath;
  if (!fs.existsSync(inputPath)) {
    console.error('Usage: node index.js <path_to_file> [--fail]');
    process.exit(1);
  }

  const outPath = path.join(os.tmpdir(), path.basename(inputPath) + '.normalized.txt');

  try {
    await pipeline(
      fs.createReadStream(inputPath),
      fail ? failAfterBytes(1024) : new Transform({ transform(c, e, cb) { cb(null, c); } }),
      lowercase(),
      collapseWhitespace(),
      fs.createWriteStream(outPath)
    );
    console.log(outPath);
  } catch (err) {
    console.error('Pipeline failed:', err.message);
    process.exit(1);
  }
}

main();

