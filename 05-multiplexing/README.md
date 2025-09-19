# Multiplexing

Simple mux/demux framing of two input streams into one file, then back into two outputs.

## Run

```bash
cd 05-multiplexing
node index.js                       # uses lorem.txt and 03/sample
node index.js ./a.txt ./b.txt       # or pass two files
```

Outputs JSON with created file paths.

