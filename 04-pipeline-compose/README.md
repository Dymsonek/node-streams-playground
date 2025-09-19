# Pipeline + Compose

Runs a simple multi-stage pipeline (lowercase, collapse whitespace) and writes to temp. Optional `--fail` to demonstrate error handling.

## Run

```bash
cd 04-pipeline-compose
node index.js                    # uses common/fixtures/lorem.txt
node index.js ./file.txt         # or pass your file
node index.js ./file.txt --fail  # triggers an error mid-pipeline
```

