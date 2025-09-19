const fs = require('fs');
const path = require('path');
const os = require('os');
const { Transform } = require('stream');
const { pipeline } = require('stream/promises');

async function main() {
  const argPath = process.argv[2];
  const inputPath = argPath ? path.resolve(argPath) : path.join(__dirname, 'sample.txt');
  if (!fs.existsSync(inputPath)) {
    console.error('Usage: node index.js <path_to_file>');
    process.exit(1);
  }

  const outName = path.basename(inputPath) + '.upper.txt';
  const outPath = path.join(os.tmpdir(), outName);

  const upper = new Transform({
    transform(chunk, enc, cb) {
      try {
        cb(null, Buffer.from(chunk.toString('utf8').toUpperCase()));
      } catch (e) {
        cb(e);
      }
    },
  });

  await pipeline(
    fs.createReadStream(inputPath),
    upper,
    fs.createWriteStream(outPath)
  );

  console.log(outPath);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

