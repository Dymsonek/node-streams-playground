const fs = require('fs');
const os = require('os');
const path = require('path');
const { Worker } = require('worker_threads');
const { once } = require('events');
const { withTimer } = require('../common/timer');

async function main() {
  const args = process.argv.slice(2);
  const given = args.find((a) => !a.startsWith('-'));
  const cIndex = args.indexOf('--concurrency');
  const concurrency = cIndex !== -1 ? Math.max(1, Number(args[cIndex + 1] || 0)) : Math.min(4, os.cpus().length);
  const inputPath = given ? path.resolve(given) : path.join(__dirname, '..', 'common', 'fixtures', 'lorem.txt');
  if (!fs.existsSync(inputPath)) {
    console.error('Usage: node index.js <path_to_file> [--concurrency N]');
    process.exit(1);
  }

  const outPath = path.join(os.tmpdir(), path.basename(inputPath) + `.chunks.sha256.txt`);
  const ws = fs.createWriteStream(outPath);

  const workers = Array.from({ length: concurrency }, () => new Worker(path.join(__dirname, 'worker.js')));
  const free = workers.slice();
  const queue = [];
  const results = new Map();
  let nextId = 0;
  let writePtr = 0;
  let inFlight = 0;
  let chunks = 0;
  let bytes = 0;

  function schedule() {
    while (free.length && queue.length) {
      const w = free.pop();
      const task = queue.shift();
      inFlight++;
      w.once('message', async (msg) => {
        inFlight--;
        free.push(w);
        results.set(msg.id, Buffer.from(msg.hex + '\n'));
        while (results.has(writePtr)) {
          const buf = results.get(writePtr);
          results.delete(writePtr);
          if (!ws.write(buf)) await once(ws, 'drain');
          writePtr++;
        }
        schedule();
      });
      w.postMessage(task);
    }
  }

  const ms = await withTimer(async () => {
    for await (const chunk of fs.createReadStream(inputPath)) {
      const id = nextId++;
      chunks++;
      bytes += chunk.length;
      queue.push({ id, chunk });
      schedule();
      while (inFlight >= concurrency && queue.length >= concurrency) await new Promise((r) => setImmediate(r));
    }
    while (writePtr < nextId) await new Promise((r) => setImmediate(r));
  })();

  ws.end();
  await once(ws, 'finish');
  for (const w of workers) w.terminate();
  console.log(JSON.stringify({ file: outPath, bytes, chunks, concurrency, ms: Number(ms.toFixed(2)) }));
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

