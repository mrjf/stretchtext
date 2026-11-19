import '../src/index.js';

const reader = document.getElementById('poem');
const rows = Array.from(reader.querySelectorAll('.original > span'), (row) => {
  const words = row.textContent.trim().split(/\s+/u);
  const initial = row.innerText.trim().split(/\s+/u);
  // Keep a short word anchored while the text on either side contracts.
  const anchor = initial.reduce((best, word, i) => word.length < initial[best].length ? i : best, 0);
  return { words, initial, anchor };
});
const originalUnits = Math.max(...rows.map((row) => row.initial.length));

reader.poem = {
  maxLines: rows.length,
  maxUnits: Math.max(...rows.map((row) => row.words.length)),
  originalUnits,
  read(lines, units) {
    return rows.slice(0, lines).map(({ words, initial, anchor }) => {
      if (units === originalUnits) return initial.join(' ');
      const start = Math.max(0, anchor - units + 1);
      return words.slice(start, start + units).join(' ');
    });
  }
};
