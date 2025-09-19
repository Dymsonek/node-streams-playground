# Node Streams Playground

Small, self‑contained exercises exploring Node.js streams. Each module lives in its own numbered folder to keep things simple and focused.

## Proposed Structure

```
.
├── 00-compression/        # Compare Brotli, Gzip, Deflate
├── 01-stream-basics/      # Readable/Writable basics and piping
├── 02-backpressure/       # Manual flow control, highWaterMark
├── 03-transform-streams/  # Build simple Transform utilities
├── 04-pipeline-compose/   # pipeline(), compose(), error handling
├── 05-multiplexing/       # Combine/split streams
├── 06-parallel-processing/# Worker threads + streams
├── 07-file-io-streams/    # fs streams, chunking, hashing
└── common/                # Shared utils (timer, fixtures)
```

Start with one folder per concept. Keep executables minimal, reuse helpers via `common/` only when duplication appears.

## Conventions

- Node `>=16`
- One entry script per module (`index.js`)
- Keep inputs in the module folder; write outputs to `os.tmpdir()`
- Prefer `stream/promises.pipeline` for safety and clarity

## Current Modules

- `00-compression` — CLI comparing Brotli, Gzip, and Deflate.
- `01-stream-basics` — Minimal read → transform (uppercase) → write using `pipeline()`.
- `02-backpressure` — Simulates a slow sink to show backpressure.
- `03-transform-streams` — Custom Transform that numbers lines.

## Running 00-compression

From this repo root:

```bash
cd 00-compression
node index.js ./sample.txt
```

## Next Steps

- Add `01-stream-basics` with minimal read→transform→write examples
- Extract `00-compression/utils/timer.js` into `common/timer.js` once a second module needs it
- Add tiny fixtures under each module (or `common/fixtures/` if reused)
