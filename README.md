# Node Streams Playground

Small, focused exercises exploring Node.js streams. Each concept lives in its own numbered folder.

## Repository Map

```
.
├── 00-compression/
├── 01-stream-basics/
├── 02-backpressure/
├── 03-transform-streams/
├── 04-pipeline-compose/
├── 05-multiplexing/
├── 06-parallel-processing/
├── 07-file-io-streams/
└── common/
```

## Learning Path

- 01 Stream Basics: Read → Transform → Write with `pipeline()`
- 02 Backpressure: Slow sinks, `highWaterMark`, `drain`
- 03 Transform Streams: Stateful transforms (line numbers)
- 04 Pipeline Compose: Multi-stage flow, error handling
- 05 Multiplexing: Frame, mux/demux multiple streams
- 06 Parallel Processing: Workers + chunk scheduling
- 07 File I/O Streams: Chunking, hashing, iteration
- 00 Compression: Compare Brotli/Gzip/Deflate timings and ratios

See EXERCISES.md for hands-on tasks.

## How To Run

- Prereq: Node `>=16`
- Generic: `cd <module> && node index.js [args]`
- Outputs: modules write results to `os.tmpdir()` and print paths/JSON

Examples:

```
cd 01-stream-basics && node index.js ./sample.txt
cd 06-parallel-processing && node index.js ./file.txt --concurrency 4
```

## Current Modules

- 00 Compression: CLI comparing Brotli, Gzip, Deflate
- 01 Stream Basics: Uppercase transform via `pipeline()`
- 02 Backpressure: Slow writable to visualize flow control
- 03 Transform Streams: Line-numbering transform
- 04 Pipeline Compose: Lowercase + collapse whitespace, optional `--fail`
- 05 Multiplexing: Mux/demux two inputs to framed file
- 06 Parallel Processing: Per-chunk SHA‑256 via workers
- 07 File I/O Streams: Chunk stats + SHA‑256

## Next Steps

- Duplex and PassThrough patterns; teeing streams
- Object mode streams for JSON/NDJSON
- `stream/web` adapters and WHATWG compatibility
- Network and HTTP streaming (sockets, requests)
- AbortController with `pipeline({ signal })`
- Shared fixtures in `common/fixtures/` (e.g., `lorem.txt`)
