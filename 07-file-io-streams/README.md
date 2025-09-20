# File I/O Streams

Reads a file as a stream, tracks bytes and chunks, and computes a SHA‑256 digest.

## Run

```bash
cd 07-file-io-streams
node index.js                         # uses common/fixtures/lorem.txt
node index.js ./file.bin --chunk 131072
```

Prints JSON with size, chunking stats, and hash.

