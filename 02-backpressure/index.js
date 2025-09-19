const { Readable, Writable } = require('stream');
const { pipeline } = require('stream/promises');
const { withTimer } = require('../common/timer');

async function run() {
  const CHUNK_SIZE = 64 * 1024;
  const CHUNKS = 1000;
  let bytes = 0;

  const source = Readable.from((async function* () {
    for (let i = 0; i < CHUNKS; i++) {
      yield Buffer.alloc(CHUNK_SIZE, 97);
    }
  })());

  const sink = new Writable({
    highWaterMark: 16,
    write(chunk, enc, cb) {
      bytes += chunk.length;
      setTimeout(cb, 1);
    },
  });

  await pipeline(source, sink);
  return bytes;
}

async function main() {
  let total = 0;
  const ms = await withTimer(async () => {
    total = await run();
  })();
  console.log(JSON.stringify({ bytes: total, ms: Number(ms.toFixed(2)) }));
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

