const fs = require('fs');
const path = require('path');
const os = require('os');
const { once } = require('events');

function writeChunk(w, buf) {
  return new Promise((resolve, reject) => {
    const ok = w.write(buf);
    if (ok) return resolve();
    w.once('error', reject);
    w.once('drain', resolve);
  });
}

async function writeFrame(w, id, payload) {
  const header = Buffer.alloc(5);
  header[0] = id & 0xff;
  header.writeUInt32BE(payload.length, 1);
  await writeChunk(w, header);
  await writeChunk(w, payload);
}

async function multiplex(aPath, bPath, outPath) {
  const a = fs.createReadStream(aPath);
  const b = fs.createReadStream(bPath);
  const out = fs.createWriteStream(outPath);

  const ita = a[Symbol.asyncIterator]();
  const itb = b[Symbol.asyncIterator]();
  let doneA = false;
  let doneB = false;
  let turn = 0;

  try {
    while (!doneA || !doneB) {
      if (turn === 0 && !doneA) {
        const { value, done } = await ita.next();
        if (done) doneA = true; else await writeFrame(out, 0, Buffer.from(value));
      } else if (turn === 1 && !doneB) {
        const { value, done } = await itb.next();
        if (done) doneB = true; else await writeFrame(out, 1, Buffer.from(value));
      }
      turn = turn ^ 1;
    }
  } finally {
    a.destroy();
    b.destroy();
    out.end();
    await once(out, 'finish');
  }
}

async function demultiplex(muxPath, outAPath, outBPath) {
  const r = fs.createReadStream(muxPath);
  const wa = fs.createWriteStream(outAPath);
  const wb = fs.createWriteStream(outBPath);
  let carry = Buffer.alloc(0);

  function writeTo(w, buf) { return writeChunk(w, buf); }

  for await (const chunk of r) {
    carry = Buffer.concat([carry, chunk]);
    while (carry.length >= 5) {
      const id = carry[0];
      const len = carry.readUInt32BE(1);
      if (carry.length < 5 + len) break;
      const payload = carry.slice(5, 5 + len);
      carry = carry.slice(5 + len);
      if (id === 0) await writeTo(wa, payload); else if (id === 1) await writeTo(wb, payload);
    }
  }

  wa.end();
  wb.end();
  await Promise.all([once(wa, 'finish'), once(wb, 'finish')]);
}

async function main() {
  const args = process.argv.slice(2);
  const aGiven = args[0];
  const bGiven = args[1];
  const aPath = aGiven ? path.resolve(aGiven) : path.join(__dirname, '..', 'common', 'fixtures', 'lorem.txt');
  const bPath = bGiven ? path.resolve(bGiven) : path.join(__dirname, '..', '03-transform-streams', 'sample.txt');
  if (!fs.existsSync(aPath) || !fs.existsSync(bPath)) {
    console.error('Usage: node index.js <fileA> <fileB>');
    process.exit(1);
  }

  const muxPath = path.join(os.tmpdir(), `${path.basename(aPath)}__${path.basename(bPath)}.mux`);
  const outAPath = path.join(os.tmpdir(), path.basename(aPath) + '.demux');
  const outBPath = path.join(os.tmpdir(), path.basename(bPath) + '.demux');

  await multiplex(aPath, bPath, muxPath);
  await demultiplex(muxPath, outAPath, outBPath);

  console.log(JSON.stringify({ mux: muxPath, a: outAPath, b: outBPath }));
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

