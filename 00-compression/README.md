# 📦 Data Compression Efficiency (Node.js Streams)

A CLI tool to compare the efficiency and speed of three compression algorithms available in Node.js's `zlib` module: **Brotli**, **Gzip**, and **Deflate**.  
This project is inspired by **Exercise 6.1** from the book *Node.js Design Patterns* (3rd Edition), focused on streaming and the fork pattern.

## 🚀 What Does It Do?

- Compresses a given file using **Brotli**, **Gzip**, and **Deflate**
- Measures the **compression time** for each algorithm
- Calculates the **output file size**
- Shows the **compression ratio** compared to the original
- Displays a clear summary table in the terminal

## 📦 Requirements

- Node.js `v16+`
- Terminal access (macOS, Linux, or Windows with WSL/PowerShell)
- No external dependencies

## 🛠️ Installation

```bash
git clone https://github.com/your-username/node-compression-efficiency.git
cd node-compression-efficiency
```

## 📥 Usage

```bash
node index.js <path_to_file> [--out-dir DIR] [--keep]
```

- `--out-dir DIR`: write compressed files to `DIR` (default: system temp)
- `--keep`: do not delete the compressed outputs after measuring

### Example output:

```
┌──────────────┬────────────┬───────────────────────┬─────────────────────┐
│  Algorithm   │ Time (ms)  │ Output Size (bytes)   │ Compression Ratio   │
├──────────────┼────────────┼───────────────────────┼─────────────────────┤
│ Brotli       │ 3.24       │ 12345                 │ 35.21%              │
│ Gzip         │ 2.10       │ 14567                 │ 41.56%              │
│ Deflate      │ 1.95       │ 14789                 │ 42.20%              │
└──────────────┴────────────┴───────────────────────┴─────────────────────┘
```

## 📁 Project Structure

```
.
├── index.js
├── compressors/
│   ├── brotli.js
│   ├── gzip.js
│   └── deflate.js
├── ../common/
│   └── timer.js
└── README.md
```

## 🧪 Sample Test Files

```bash
yes "Mauris ut ipsum eget magna mollis blandit." | head -n 100000 > repetitive.txt
head -c 1M </dev/urandom | base64 > random.txt
```

## 💡 Possible Improvements

- [ ] Add decompression time
- [ ] Verify decompressed output (e.g., SHA256)
- [ ] Export results to `.json` or `.csv`
- [ ] Support multiple input files
- [ ] Add CLI flags like `--keep`, `--clean`, `--out-dir`

## 📚 References

- [Node.js Design Patterns](https://www.oreilly.com/library/view/nodejs-design-patterns/9781839214110/)
- [Node.js `zlib` Docs](https://nodejs.org/api/zlib.html)
- [Node.js Streams](https://nodejs.org/api/stream.html)
