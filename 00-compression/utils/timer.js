function withTimer(fn) {
  return async (...args) => {
    const start = process.hrtime.bigint();
    await fn(...args);
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000;
  };
}

module.exports = { withTimer };
