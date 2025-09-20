# Parallel Processing

Hashes file chunks in parallel using worker threads and writes per-chunk SHA‑256 hex lines to temp.

## Run

```bash
cd 06-parallel-processing
node index.js                           # uses common/fixtures/lorem.txt
node index.js ./file.txt --concurrency 4
```

Prints JSON with output path and timing.

